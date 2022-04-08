import * as tl from "@akashic-extension/akashic-timeline";
import { define } from "./define";
import { AssetInfo } from "./assetInfo";
import { entityUtil } from "../util/entityUtil";
import { gameUtil } from "../util/gameUtil";
import { spriteUtil } from "../util/spriteUtil";

/**
 * 取得ポイント"+000"アニメの管理、表示を行うクラス
 */
export class PointAdder extends g.E {
	/** ポイント数ラベル */
	private pointLabel: g.Label;
	/** ＋ スプライト */
	private sprPointAdderPlus: g.Sprite;
	/** － スプライト */
	private sprPointAdderMinus: g.Sprite;

	/**
	 * 継承元のコンストラクタをよぶ
	 * @param  {g.Scene} _scene シーン
	 */
	constructor(_scene: g.Scene) {
		super({ scene: _scene });
	}

	/**
	 * フォント表示部分生成
	 */
	createLabel(): void {
		const spoScore = spriteUtil.createSpriteParameter(AssetInfo.numWg);
		const sfmNumWG = spriteUtil.createSpriteFrameMap(AssetInfo.numWg);

		const charW: number = AssetInfo.numWg.fontWidth;
		const scoreDigit: number = define.GET_POINT_DIGIT;
		const fontGreen = gameUtil.createNumFontWithAssetInfo(AssetInfo.numWg);
		this.opacity = 0;
		this.modified();

		this.pointLabel = entityUtil.createLabel(
			this.scene, "0000", fontGreen, scoreDigit, "left");
		entityUtil.setXY(this.pointLabel, define.GET_POINT_X, define.GET_POINT_Y);
		this.append(this.pointLabel);
		// ＋
		this.sprPointAdderPlus = spriteUtil.createFrameSprite(spoScore, sfmNumWG, "num_W_export0012.png");
		this.append(this.sprPointAdderPlus);
		entityUtil.setXY(this.sprPointAdderPlus, this.pointLabel.x - (charW * scoreDigit / 2), this.pointLabel.y);
		// －
		this.sprPointAdderMinus = spriteUtil.createFrameSprite(spoScore, sfmNumWG, "num_W_export0013.png");
		this.append(this.sprPointAdderMinus);
		entityUtil.setXY(this.sprPointAdderMinus, this.pointLabel.x - (charW * scoreDigit / 2), this.pointLabel.y);
	}

	/**
	 * 取得スコア表示
	 * @param {number} _value スコア値
	 * @param {number} _x     スコア表示座標x値
	 * @param {number} _y     スコア表示座標y値
	 */
	dispPointAdder(_value: number, _x: number, _y: number): void {
		entityUtil.setLabelText(this.pointLabel, String(_value));

		let operator: g.Sprite = null;
		if (_value >= 0) {
			operator = this.sprPointAdderPlus;
			this.sprPointAdderPlus.opacity = 1;
			this.sprPointAdderMinus.opacity = 0;
		} else {
			operator = this.sprPointAdderMinus;
			this.sprPointAdderPlus.opacity = 0;
			this.sprPointAdderMinus.opacity = 1;
		}
		this.sprPointAdderPlus.modified();
		this.sprPointAdderMinus.modified();
		entityUtil.setX(operator, this.pointLabel.x - AssetInfo.numWg.fontWidth);

		this.opacity = 1;
		entityUtil.setXY(this, _x, _y);
		const timeline = this.scene.game.vars.scenedata.timeline;
		const tween: tl.Tween = gameUtil.createTween(timeline, this);
		tween.wait(500).to({ y: (_y - 10), opacity: 0 }, 1000);
	}
}
