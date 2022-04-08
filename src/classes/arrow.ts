import { define } from "./define";
import { AssetInfo } from "./assetInfo";
import { entityUtil } from "../util/entityUtil";
import { spriteUtil } from "../util/spriteUtil";
import { GameParameterReader } from "./gameParameterReader";

/**
 * ゲージ矢印の管理、表示を行うクラス
 */
export class Arrow extends g.E {
	/** 矢印が1frameに移動する単位 */
	private dy: number = 0;
	/** 矢印画像スプライト */
	private arrowIcon: g.Sprite = null;
	/** 一時停止中の矢印移動単位保存先 */
	private keepDy: number = 0;
	/** 矢印画像の半分の高さ */
	private arrowHhalf: number = 0;
	/** 矢印画像の幅 */
	private gaugeHeight: number = 0;

	/**
	 * 継承元のコンストラクタをよぶ
	 * @param  {g.Scene} _scene シーン
	 */
	constructor(_scene: g.Scene) {
		super({ scene: _scene });
	}

	/**
	 * 矢印生成
	 */
	init(): void {
		const spoUi = spriteUtil.createSpriteParameter(AssetInfo.ui);
		const sfmUi = spriteUtil.createSpriteFrameMap(AssetInfo.ui);
		this.arrowIcon = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.uiArrow);
		this.append(this.arrowIcon);
		this.resetPosition();

		this.arrowHhalf = this.arrowIcon.height / 2;
	}

	/**
	 * ゲージの高さをクラスのプロパティへセットする
	 * @param {number} _gaugeHeight ゲージの高さ(pixel)
	 */
	setGauge(_gaugeHeight: number): void {
		this.gaugeHeight = _gaugeHeight;
	}

	/**
	 * タップ時処理
	 * @param  {number} _kind アイテム種類
	 * @return {number}       割る力のレベル
	 */
	handleTap(_kind: number): number {
		// 力の強さ
		const strength: number = this.getArrowPosition();
		// アイテム種類と力を比較して割るレベルを算出
		const level: number = this.getLevel(_kind, strength);
		return level;
	}

	/**
	 * 矢印スタート(初回のみ)
	 */
	public start(): void {
		this.dy = GameParameterReader.gaugeSpeed;
	}

	/**
	 * 矢印停止
	 */
	public stop(): void {
		if (this.dy !== 0) {
			this.keepDy = this.dy;
		}
		this.dy = 0;
	}

	/**
	 * game再開
	 * @param {number} _kind アイテム種類
	 */
	public restart(_kind: number): void {
		const direction: number = (this.keepDy < 0) ? -1 : 1;
		this.dy = (GameParameterReader.gaugeSpeed + GameParameterReader.gaugeSpeedAdd[_kind]) * direction;
	}

	/**
	 * 矢印アイコン位置リセット
	 */
	public resetPosition(): void {
		entityUtil.setXY(this.arrowIcon, 0, 0);
	}

	/**
	 * 停止位置のY座標をゲージ目盛に変換
	 * @return {number} 1-100の値
	 */
	public getArrowPosition(): number {
		const scaleGauge = this.gaugeHeight / 100;
		const arrowY = this.gaugeHeight - (this.arrowIcon.y + this.arrowHhalf);
		const strength = Math.floor(arrowY / scaleGauge);
		return strength;
	}

	/**
	 * 毎フレームの更新処理
	 */
	handleUpdate(): void {
		if (this.dy !== 0) {
			// ゲージの座標移動
			this.arrowIcon.y += this.dy;

			// 上下限折り返し判定
			if (this.arrowIcon.y <= 0 && this.dy < 0) { // 上限
				this.dy = Math.abs(this.dy); // プラスに
			} else if (
				this.arrowIcon.y > this.gaugeHeight - this.arrowHhalf - GameParameterReader.gaugeSpeed &&
				this.dy > 0
			) { // 下限
				this.dy = -(Math.abs(this.dy)); // マイナスに
			}
		}
	}

	/**
	 * 割る力のレベル取得
	 * @param  {number} _kind アイテム種類
	 * @param  {number} _str  ゲージ目盛[1-100]
	 * @return {number}       割る力のレベル
	 */
	private getLevel(_kind: number, _str: number): number {
		// アイテム種類別にゲージの当落テーブルが設定されている
		const gaugeTable = define.ITEM_GAUGE_SCALE[_kind];
		let level: number = 0;
		let i: number = 0;
		const gaugeLength: number = gaugeTable.length;
		// 当落テーブル内
		for (; i < gaugeLength; ++i) {
			const scaleValue: number = gaugeTable[i];
			if (_str <= scaleValue) {
				level = i;
				break;
			}
		}
		// 最大値を超えた場合
		if (i >= gaugeLength) {
			level = gaugeLength - 1;
		}
		return level;
	}
}
