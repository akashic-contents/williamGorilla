import * as tl from "@akashic-extension/akashic-timeline";
import { define } from "./define";
import { AssetInfo } from "./assetInfo";
import { SoundInfo } from "./soundInfo";
import { entityUtil } from "../util/entityUtil";
import { spriteUtil } from "../util/spriteUtil";
import { gameUtil } from "../util/gameUtil";
import { audioUtil } from "../util/audioUtil";
import { TimerLabel } from "./timerLabel";
import { PlayerClass } from "./playerClass";
import { Arrow } from "./arrow";
import { Effect } from "./effect";
import { PointAdder } from "./pointAdder";
import { ComboAdder } from "./comboAdder";
import { GaugeIcon } from "./gaugeIcon";
import { GameParameterReader } from "./gameParameterReader";
import { Score } from "./score";
import { GameBase } from "../commonNicowariGame/gameBase";
import { CommonParameterReader } from "../commonNicowariGame/commonParameterReader";

/** デバッグ OKに入ったら自動でクリックフラグ */
const DEBUG_AUTO_OK: boolean = false; // for debug

/**
 * ゲームの実体を実装するクラス
 */
export class WilliamGorilla extends GameBase {
	/** ゲーム中フラグ */
	private inGame: boolean;

	/** スコア値 */
	private scoreValue: number;
	/** ライフ値 */
	private lifeValue: number;
	/** 残り時間表示ラベル */
	private timerLabel: TimerLabel;
	/** ゲージ矢印classインスタンス */
	private arrow: Arrow;
	/** ゲージアイコンclassインスタンス */
	private gaugeIcon: GaugeIcon;
	/** ゴリラclassインスタンス */
	private player: PlayerClass;
	/** マンガ効果classインスタンス */
	private effect: Effect;
	/** コンボ数 */
	private comboCount: number;
	/** コンボclassインスタンス */
	private comboAdder: ComboAdder;
	/** 取得したpoint表示classインスタンス */
	private pointAdder: PointAdder;
	/** 連打防止フラグ */
	private isTouch: boolean;
	/** レア出現済みフラグ */
	private isRareAppear: boolean;
	/** パラメータ化対応 制限時間 */
	private timeLimit: number;
	/** パラメータ化対応 アイテム種類増加間隔 */
	private itemKindInterval: number;
	/** スコア */
	private score: Score;

	/**
	 * 継承元のコンストラクタをよぶ
	 * @param  {g.Scene} _scene シーン
	 */
	constructor(_scene: g.Scene) {
		super(_scene);
	}

	/**
	 * このクラスで使用するオブジェクトを生成するメソッド
	 * Scene#loadedを起点とする処理からコンストラクタの直後に呼ばれる。
	 * このクラスはゲーム画面終了時も破棄されず、次のゲームで再利用される。
	 * そのためゲーム状態の初期化はinitではなくshowContentで行う必要がある。
	 * @override
	 */
	init(): void {
		super.init();
		GameParameterReader.read(this.scene);

		const scene = this.scene;
		const spoUi = spriteUtil.createSpriteParameter(AssetInfo.ui);
		const sfmUi = spriteUtil.createSpriteFrameMap(AssetInfo.ui);

		const player = this.player = new PlayerClass(this.scene);
		player.init();
		entityUtil.setXY(player, 0, 0);
		entityUtil.appendEntity(player, this);

		const iconClock = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.iconClock);
		iconClock.moveTo(define.ICON_T_X, define.ICON_T_Y);
		entityUtil.appendEntity(iconClock, this);

		const iconMax = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.iconMax);
		iconMax.moveTo(define.ICON_MAX_X, define.ICON_MAX_Y);
		entityUtil.appendEntity(iconMax, this);

		const iconMin = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.iconMin);
		iconMin.moveTo(define.ICON_MIN_X, define.ICON_MIN_Y);
		entityUtil.appendEntity(iconMin, this);

		const iconPt = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.iconPt);
		iconPt.moveTo(define.ICON_PT_X, define.ICON_PT_Y);
		entityUtil.appendEntity(iconPt, this);

		const uiGauge = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.uiGauge);
		uiGauge.moveTo(define.UI_GAUGE_X, define.UI_GAUGE_Y);
		entityUtil.appendEntity(uiGauge, this);

		const timer = this.timerLabel = new TimerLabel(scene);
		timer.createLabel(AssetInfo.numBlack, AssetInfo.numRed);
		timer.moveLabelTo(define.GAME_TIMER_X, define.GAME_TIMER_Y);
		entityUtil.appendEntity(timer, this);

		const fontBlack = gameUtil.createNumFontWithAssetInfo(
			AssetInfo.numBlack);

		this.score = new Score(this.scene);
		entityUtil.appendEntity(this.score, this);
		this.score.createScoreLabel(
			fontBlack,
			define.GAME_SCORE_DIGIT,
			{ x: define.GAME_SCORE_X, y: define.GAME_SCORE_Y }
		);

		// UI
		this.pointAdder = new PointAdder(scene);
		this.pointAdder.opacity = 0;
		entityUtil.setXY(this.pointAdder, 0, 0);
		this.pointAdder.createLabel();
		entityUtil.appendEntity(this.pointAdder, this);

		this.comboAdder = new ComboAdder(scene);
		entityUtil.setXY(this.comboAdder, 0, 0);
		this.comboAdder.createLabel();
		entityUtil.appendEntity(this.comboAdder, this);

		const gaugeIcon = this.gaugeIcon = new GaugeIcon(this.scene);
		gaugeIcon.init();
		entityUtil.setXY(gaugeIcon, define.UI_GAUGE_X, define.UI_GAUGE_Y);
		entityUtil.appendEntity(gaugeIcon, this);

		const arrow = this.arrow = new Arrow(this.scene);
		arrow.init();
		arrow.setGauge(uiGauge.height);
		entityUtil.setXY(arrow, define.UI_ARROW_X, define.UI_ARROW_Y);
		entityUtil.appendEntity(arrow, this);

		const effect = this.effect = new Effect(this.scene);
		effect.init();
		entityUtil.setXY(effect, 0, 0);
		entityUtil.appendEntity(effect, this);
	}

	/**
	 * 表示系以外のオブジェクトをdestroyするメソッド
	 * 表示系のオブジェクトはg.Eのdestroyに任せる。
	 * @override
	 */
	destroy(): void {
		super.destroy();
	}

	/**
	 * 表示を開始するメソッド
	 * ゲーム画面に遷移するワイプ演出で表示が始まる時点で呼ばれる。
	 * @override
	 */
	showContent(): void {
		this.inGame = false;
		this.scoreValue = 0;
		this.comboCount = 0;
		this.lifeValue = define.DEFAULT_LIFE;
		this.isTouch = false;
		this.isRareAppear = false;

		this.score.init();

		this.timeLimit = define.GAME_TIME;
		if (CommonParameterReader.useGameTimeLimit) {
			this.timeLimit = CommonParameterReader.gameTimeLimit;
			if (this.timeLimit > define.GAME_TIME_MAX) {
				this.timeLimit = define.GAME_TIME_MAX;
			}
		} else if (CommonParameterReader.useGameTimeMax) {
			this.timeLimit = define.GAME_TIME_MAX;
		}

		// パラメータで制限時間が変更された場合の対応
		this.itemKindInterval = define.ITEM_KIND_INTERVAL;
		if (this.timeLimit !== define.GAME_TIME) { // 変更があった場合のみ
			// もとのゲーム時間とアイテム種類増加間隔との倍率
			const magnification: number = Math.floor(define.GAME_TIME / define.ITEM_KIND_INTERVAL);
			const wkInterval: number = Math.floor(this.timeLimit / magnification); // 変更された時間での間隔を計算
			this.itemKindInterval = wkInterval === 0 ? 0.1 : wkInterval; // 0割を回避
		}

		this.timerLabel.setTimeCount(this.timeLimit);
		this.timerLabel.timeCaution.handle(this, this.onTimeCaution);
		this.timerLabel.timeCautionCancel.handle(
			this, this.onTimeCautionCancel);
		// ゲーム初期化
		this.player.gameReset();
		this.arrow.resetPosition();
		this.gaugeIcon.gameReset();

		super.showContent();
	}

	/**
	 * ゲームを開始するメソッド
	 * ReadyGo演出が完了した時点で呼ばれる。
	 * @override
	 */
	startGame(): void {
		this.inGame = true;
		this.scene.pointDownCapture.handle(this, this.onTouch);

		this.arrow.start();
		// 初回はりんご固定
		this.player.gameStart(this.lifeValue, define.Item.APPLE, true);
		this.gaugeIcon.setKind(this.player.getItemKind());
	}

	/**
	 * 表示を終了するメソッド
	 * このサブシーンから遷移するワイプ演出で表示が終わる時点で呼ばれる。
	 * @override
	 */
	hideContent(): void {
		this.timerLabel.timeCaution.removeAll(this);
		this.timerLabel.timeCautionCancel.removeAll(this);
		super.hideContent();
	}

	/**
	 * Scene#updateを起点とする処理から呼ばれるメソッド
	 * ゲーム画面でない期間には呼ばれない。
	 * @override
	 */
	onUpdate(): void {
		if (this.inGame) {
			this.score.onUpdate();
			this.timerLabel.tick();
			if (this.timerLabel.getTimeCount() === 0) {
				this.player.gameEnd();
				this.effect.endAnim();
				this.finishGame();
			} else {
				this.player.onUpdate();
				this.arrow.onUpdate();
				this.effect.onUpdate();

				// for debug
				if (DEBUG_AUTO_OK) { // 自動OK
					const arrowPos = this.arrow.getArrowPosition();
					const itemKind = this.player.getItemKind();
					if (arrowPos > define.ITEM_GAUGE_SCALE[itemKind][define.PowerLevel.LEVEL_SOFT] &&
						arrowPos <= define.ITEM_GAUGE_SCALE[itemKind][define.PowerLevel.LEVEL_OK_MAX]) {
						this.scene.pointDownCapture.fire();
					}
				}
			}
		}
	}

	/**
	 * タイトル画面のBGMのアセット名を返すメソッド
	 * 共通フロー側でBGMを鳴らさない場合は実装クラスでオーバーライドして
	 * 空文字列を返すようにする
	 * @return {string} アセット名
	 */
	getTitleBgmName(): string {
		return SoundInfo.bgmSet.title;
	}

	/**
	 * ゲーム中のBGMのアセット名を返すメソッド
	 * 共通フロー側でBGMを鳴らさない場合は実装クラスでオーバーライドして
	 * 空文字列を返すようにする
	 * @return {string} アセット名
	 */
	getMainBgmName(): string {
		return SoundInfo.bgmSet.main;
	}

	/**
	 * TimerLabel#timeCautionのハンドラ
	 */
	private onTimeCaution(): void {
		this.timeCaution.fire();
	}

	/**
	 * TimerLabel#timeCautionCancelのハンドラ
	 */
	private onTimeCautionCancel(): void {
		this.timeCautionCancel.fire();
	}

	/**
	 * ゲームを終了するメソッド
	 * gameUtil.setGameScoreしたスコアが結果画面で表示される。
	 * @param {boolean = false} opt_isLifeZero
	 * (optional)ライフ消滅によるゲーム終了の場合はtrue
	 */
	private finishGame(opt_isLifeZero: boolean = false): void {
		this.inGame = false;
		this.scene.pointDownCapture.removeAll(this);
		this.score.onFinishGame();
		gameUtil.setGameScore(this.scoreValue);
		// 呼び出すトリガーによって共通フローのジングルアニメが変化する
		if (opt_isLifeZero) {
			this.gameOver.fire();
			this.timerLabel.forceStopBlink();
			audioUtil.play(SoundInfo.seSet.gameover);
		} else {
			this.timeup.fire();
		}
	}

	/**
	 * Scene#pointDownCaptureのハンドラ
	 * @param {g.PointDownEvent} _e イベントパラメータ
	 * @return {boolean}            ゲーム終了時はtrueを返す
	 */
	private onTouch(_e: g.PointDownEvent): boolean {
		if (!this.inGame) {
			return true;
		}

		// 実際の動作
		this.checkTouchHead();
		return false;
	}

	/**
	 * タップ時の処理
	 */
	private checkTouchHead(): void {
		if (this.isTouch) {
			return;
		}
		this.isTouch = true;
		// ゲージ移動停止
		this.arrow.stop();

		// アイテム種類
		const kind = this.player.getItemKind();
		// 叩いた力のレベル
		const level = this.arrow.onTap(kind);
		// プレイヤークラスのタップ時処理起動
		this.player.onTap(level, this.lifeValue);
		this.setAudioTap(level);
		// effect
		const timeline: tl.Timeline = this.scene.game.vars.scenedata.timeline;
		const tweenEffect = gameUtil.createTween(timeline, this.effect);
		tweenEffect.wait(define.ARM_HIT_FRAME)
			.call((): void => {
				this.effect.checkActionEffect(level, kind);
			});

		// life
		this.checkLife(level);
		// score
		this.checkScore(level, kind);

		// 顔アニメを戻すまでの時間
		let waitTime: number = 30;
		// 叩いた力が強すぎた場合
		if (level > define.PowerLevel.LEVEL_OK_MAX) {
			waitTime = define.PENALTY_WAIT_TIME; // 長めにピヨる
		}
		const tweenPlayer = gameUtil.createTween(timeline, this.player);
		tweenPlayer.wait((waitTime * 1000) / g.game.fps)
			.call((): void => {
				// 指定した時間後に戻る
				this.restartGame();
			});
	}

	/**
	 * ライフ更新
	 * @param {number} _level ゲージレベル
	 */
	private checkLife(_level: number): void {
		if (_level > define.PowerLevel.LEVEL_OK_MAX) {
			this.lifeValue -= 1;
		}

		if (this.lifeValue < 0) {
			// game end
			this.lifeValue = 0;
		}
	}

	/**
	 * 得点計算
	 * @param {number} _level ゲージレベル
	 * @param {number} _kind  アイテム種類
	 */
	private checkScore(_level: number, _kind: number): void {
		const basepoint = define.ITEM_BASE_POINT[_kind]; // 基礎値
		const magnification = define.GAUGE_MAGNIFICATION[_level]; // 倍率

		// コンボ判定
		if (_level < define.PowerLevel.LEVEL_OK_MIN || _level > define.PowerLevel.LEVEL_OK_MAX) {
			this.comboCount = 0;
		} else {
			this.comboCount += 1;
		}
		// 得点計算
		{
			let point: number = basepoint * magnification;
			if (this.comboCount > 1) {
				// コンボボーナス加算
				point *= 1 + (this.comboCount / 10);
			}
			const getPoint: number = Math.round(point);
			if (getPoint > 0) {
				this.scoreValue += getPoint;
				if (this.scoreValue > define.SCORE_LIMIT) {
					this.scoreValue = define.SCORE_LIMIT;
				}
				this.pointAdder.dispPointAdder(getPoint, 0, 0);
				// for debug
				// console.log("kind:" + _kind + " level:" + _level + " point:" + getPoint);
				if (this.comboCount > 1) {
					this.comboAdder.dispComboAdder(this.comboCount, 0, 0);
				}

				this.score.startPlus(getPoint);
			}
		}
	}

	/**
	 * 経過時間から出現する種類を限定する
	 * @return {number} アイテムの出現種類の上限
	 */
	private getItemSeed(): number {
		const now: number = this.timeLimit - this.timerLabel.getTimeCountReal();
		// インターバル時間が過ぎるごとに出現アイテムの種類上限が上がる
		let kindSeed: number = Math.floor(now / this.itemKindInterval) + 1;
		if (kindSeed > define.Item.BOX) {
			kindSeed = define.Item.BOX; // 宝箱が最大
		}
		return kindSeed;
	}

	/**
	 * タップ時の音再生
	 * @param {number} _level 叩いた力のレベル
	 */
	private setAudioTap(_level: number): void {
		if (_level < define.PowerLevel.LEVEL_OK_MIN) {
			audioUtil.play(SoundInfo.seSet.tap1);
		} else if (_level === define.PowerLevel.LEVEL_CRITICAL) {
			audioUtil.play(SoundInfo.seSet.tap3);
		} else if (_level >= define.PowerLevel.LEVEL_OK_MIN && _level <= define.PowerLevel.LEVEL_OK_MAX) {
			audioUtil.play(SoundInfo.seSet.tap2);
		} else {
			audioUtil.play(SoundInfo.seSet.tap4);
		}
	}

	/**
	 * ゲーム再開
	 */
	private restartGame(): void {
		const now: number = this.timerLabel.getTimeCountReal();
		if (now < 1) {
			return;
		}
		// アイテム種類抽選の上限値を取得
		const itemSeed: number = this.getItemSeed();
		// レアアイテム出現時刻を過ぎている 且つ まだレアアイテムが出現していない場合
		if (now < define.RARE_APPEAR && !this.isRareAppear) {
			// アイテムを置く（種類を指定して出現させる）
			this.player.gameStart(this.lifeValue, define.Item.BOX, true);
			this.isRareAppear = true;
		} else {
			// アイテムを置く（種類の指定はplayerクラスからItemクラス内の抽選に任せる）
			this.player.gameStart(this.lifeValue, itemSeed);
		}

		// 決定したアイテムの種類を取得
		const iconKind: number = this.player.getItemKind();
		this.gaugeIcon.setKind(iconKind);
		// ゲージ矢印を動かし始める
		this.arrow.restart(iconKind);
		// タッチ検知再開
		this.isTouch = false;
	}
}
