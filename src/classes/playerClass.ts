import { entityUtil } from "../util/entityUtil";
import { asaEx } from "../util/asaEx";
import { AsaInfo } from "./asaInfo";
import { define } from "./define";
import { audioUtil } from "../util/audioUtil";
import { SoundInfo } from "./soundInfo";
import { CrushItem } from "./crushItem";

/**
 * ゴリラのアニメ及び割る力の管理クラス
 * アイテムのインスタンスを持つ
 */
export class PlayerClass extends g.E {
	/** ゴリラの顔 */
	private face: asaEx.Actor;
	/** 向かって左の腕 */
	private leftHand: asaEx.Actor;
	/** 向かって右の腕 */
	private rightHand: asaEx.Actor;
	/** 体 */
	private body: asaEx.Actor;
	/** アイテムclassのインスタンス */
	private item: CrushItem;
	/** アイテム種類 */
	private itemKind: number;
	/** 左腕アニメ再生開始フラグ */
	private isPutStart: boolean;
	/** 右腕アニメ再生開始フラグ */
	private isCrushStart: boolean;
	/** 割る力のレベル */
	private level: number;
	/** 置く体アニメフラグ */
	private PUT: boolean = false;
	/** 砕く体アニメフラグ */
	private CRUSH: boolean = true;

	/**
	 * 継承元のコンストラクタをよぶ
	 * @param  {g.Scene} _scene シーン
	 */
	constructor(_scene: g.Scene) {
		super({ scene: _scene });
	}

	/**
	 * 生成
	 */
	init(): void {
		const centerW: number = g.game.width / 2;
		const centerH: number = g.game.height / 2;
		const bottom: number = g.game.height;
		// 体
		this.body = new asaEx.Actor(this.scene, AsaInfo.hand.pj);
		this.append(this.body);
		entityUtil.setXY(this.body, centerW, centerH);
		this.setBodyAnim(this.PUT);
		// 顔
		this.face = new asaEx.Actor(this.scene, AsaInfo.face.pj);
		this.append(this.face);
		entityUtil.setXY(this.face, centerW, bottom);
		this.setIdleFace(define.DEFAULT_LIFE);

		// アイテム
		this.item = new CrushItem(this.scene);
		this.item.init();
		this.append(this.item);
		entityUtil.setXY(this.item, 0, 0);
		this.itemKind = define.Item.APPLE;

		// 左手
		this.leftHand = new asaEx.Actor(this.scene, AsaInfo.hand.pj);
		this.append(this.leftHand);
		entityUtil.setXY(this.leftHand, centerW, centerH);
		this.setLeftAnim();
		entityUtil.hideEntity(this.leftHand);

		// 右手
		this.rightHand = new asaEx.Actor(this.scene, AsaInfo.hand.pj);
		this.append(this.rightHand);
		entityUtil.setXY(this.rightHand, centerW, centerH);
		this.setRightAnim();
		entityUtil.hideEntity(this.rightHand);

		this.isPutStart = false;

	}

	/**
	 * アイテム種類取得
	 * @return {number} アイテム種類
	 */
	public getItemKind(): number {
		return this.itemKind;
	}

	/**
	 * ゲーム開始：顔を戻してアイテム置く
	 * @param {number}          _lifeValue 残りライフ(隠しパラメータ)
	 * @param {number}          _itemSeed  出現アイテム種類上限
	 * @param {boolean = false} opt_isKind 指定アイテム出現(false:ランダム抽選）
	 */
	public gameStart(_lifeValue: number, _itemSeed: number, opt_isKind: boolean = false): void {
		// idle顔アニメ
		this.setIdleFace(_lifeValue);
		// item決定
		if (opt_isKind) {
			this.itemKind = _itemSeed;
		} else {
			this.itemKind = this.choiceItemKind(_itemSeed);
		}
		this.putItem();
	}

	/**
	 * ゲーム終了(アイテム非表示)
	 */
	gameEnd(): void {
		this.item.endAnim();
	}

	/**
	 * アイテムと各パーツアニメ初期化
	 */
	gameReset(): void {
		this.item.endAnim();
		this.setIdleFace(define.DEFAULT_LIFE);
	}

	/**
	 * アイテム置く一連動作
	 */
	putItem(): void {
		// 左腕:アイテム置くアニメ再生1回
		this.setLeftAnim();
		// 体:アニメ再生1回
		this.setBodyAnim(this.PUT);
		this.isPutStart = true;
	}

	/**
	 * タップ時処理
	 * @param {number} _level     割る力のレベル
	 * @param {number} _lifeValue 残りライフ
	 */
	handleTap(_level: number, _lifeValue: number): void {
		this.setBodyAnim(this.CRUSH); // 割る
		// 右腕:アニメ再生1回
		this.setRightAnim();
		// 顔:アニメ再生1回
		this.setFaceAnim(_lifeValue, _level);

		this.isCrushStart = true;
		this.level = _level;
	}

	/**
	 * 毎フレームの更新処理
	 */
	handleUpdate(): void {
		if (this.isPutStart === true) {
			// 左腕（アイテムを置く）アニメが頭の上まで進んだ時
			if (this.leftHand.currentFrame === define.ARM_HIT_FRAME) {
				this.item.startAnim(this.itemKind); // アイテム表示開始
				this.isPutStart = false;
				if (this.itemKind === define.Item.BOX) {
					audioUtil.play(SoundInfo.seSet.setBox); // 宝箱の時は特殊音
				} else {
					audioUtil.play(SoundInfo.seSet.seton);
				}
			}
		}
		if (this.isCrushStart === true) {
			// 右腕(割る)アニメが頭の上まで進んだ時
			if (this.rightHand.currentFrame === define.ARM_HIT_FRAME) {
				this.item.setCrushAnim(this.level); // アイテム割れるアニメ開始
				this.isCrushStart = false;
				if (this.itemKind === define.Item.BOX
					&& this.level >= define.PowerLevel.LEVEL_OK_MIN
					&& this.level <= define.PowerLevel.LEVEL_OK_MAX
				) {
					audioUtil.play(SoundInfo.seSet.boxOpen); // 宝箱が割れる時は特殊音
				}
			}
		}
		this.item.handleUpdate();
		this.face.modified();
		this.face.calc();
		this.leftHand.modified();
		this.leftHand.calc();
		this.rightHand.modified();
		this.rightHand.calc();
		this.body.modified();
		this.body.calc();
	}

	/**
	 * 顔アニメ再生
	 * @param {number} _life  残りライフ数
	 * @param {number} _level 割る力のレベル
	 */
	private setFaceAnim(_life: number, _level: number): void {
		// アニメ名取得
		let animname: string = "";
		const facelevel: number = _level;
		animname = define.FACE_ANIM[_life][facelevel];
		// ループ再生
		this.face.play(animname, 0, true, 1);
	}

	/**
	 * 体{置く/割る}アニメ再生
	 * @param {boolean} _isCrush 割るアクション
	 */
	private setBodyAnim(_isCrush: boolean): void {
		// 再生1回＞最後のフレームで停止
		let animname: string = "";
		if (_isCrush) {
			animname = AsaInfo.hand.anim.bodyLeft; // 割る
		} else {
			animname = AsaInfo.hand.anim.bodyRight; // 置く
		}
		this.body.play(animname, 0, false, 1);
	}

	/**
	 * 右手アニメ再生
	 */
	private setRightAnim(): void {
		// =頭を叩く
		entityUtil.showEntity(this.rightHand);
		const animname: string = AsaInfo.hand.anim.handRight;
		this.rightHand.play(animname, 0, false, 1);
	}

	/**
	 * 左手アニメ再生
	 */
	private setLeftAnim(): void {
		// =アイテムを置く
		entityUtil.showEntity(this.leftHand);
		const animname: string = AsaInfo.hand.anim.handLeft; // 置く
		this.leftHand.play(animname, 0, false, 1);
	}

	/**
	 * アイテム種類設定
	 * @param  {number} _kindSeed アイテム種類上限
	 * @return {number}           アイテム種類
	 */
	private choiceItemKind(_kindSeed: number): number {
		let kind: number;
		const table: number[] = [0, 0, 0, 0, 0, 0, 0];
		// 確率合計
		let total: number = 0;
		for (let i = 0; i <= _kindSeed; ++i) {
			total += define.ITEM_TABLE[i];
			table[i] = total; // 抽選用テーブルを作る
		}
		// アイテム種類抽選
		const param = Math.floor(this.scene.game.random.generate() * total);
		for (kind = 0; kind < _kindSeed; ++kind) {
			if (param <= table[kind]) {
				break;
			}
		}
		return kind;
	}

	/**
	 * 顔アニメ
	 * @param {number} _life 残りライフ
	 */
	private setIdleFace(_life: number): void {
		const idleLevel: number = define.FACE_ANIM[0].length - 1;
		this.setFaceAnim(_life, idleLevel);
	}
}
