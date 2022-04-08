import * as tl from "@akashic-extension/akashic-timeline";
import { define } from "./define";
import { AsaInfo } from "./asaInfo";
import { AssetInfo } from "./assetInfo";
import { entityUtil } from "../util/entityUtil";
import { gameUtil } from "../util/gameUtil";
import { asaEx } from "../util/asaEx";

/**
 * コンボ数アニメの管理、表示を行うクラス
 */
export class ComboAdder extends g.E {
	/** コンボ数部分のラベル */
	private comboLabel: g.Label;
	/** COMBOの文字アニメ */
	private comboActor: asaEx.Actor;
	/** COMBOアニメのアタッチポイント名 */
	private pointName: string = "num";

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
		// 生成して非表示にしておく
		const actor: asaEx.Actor = new asaEx.Actor(this.scene, AsaInfo.combo.pj);
		entityUtil.setXY(actor, define.UI_COMBO_X, define.UI_COMBO_Y);
		actor.onUpdate.add(() => {
			actor.modified();
			actor.calc();
		});
		this.comboActor = actor;
		this.append(this.comboActor);
		this.opacity = 0;
		this.modified();

		const comboDigit: number = define.GET_POINT_DIGIT;
		const fontCombo = gameUtil.createNumFontWithAssetInfo(AssetInfo.numCombo);
		this.comboLabel = entityUtil.createLabel(
			this.scene, "00", fontCombo, comboDigit, "left");
		entityUtil.appendEntity(this.comboLabel, this.comboActor);
		this.comboLabel.onUpdate.add(() => {
			const pos: g.CommonOffset = this.comboActor.getBonePosition(this.pointName);
			pos.x = pos.x + (AssetInfo.numCombo.fontWidth * 3);
			pos.y = pos.y + 1.5;
			entityUtil.moveNumLabelTo(this.comboLabel, pos.x, pos.y);
			this.comboLabel.modified();
		});
	}

	/**
	 * コンボ表示
	 * @param {number} _value コンボ値
	 * @param {number} _x     コンボ表示座標x値
	 * @param {number} _y     コンボ表示座標x値
	 */
	dispComboAdder(_value: number, _x: number, _y: number): void {
		entityUtil.setLabelText(this.comboLabel, String(_value));
		// console.log("dispComboAdder: value:" + _value); // for debug
		this.comboLabel.opacity = 1;
		this.comboLabel.modified();

		this.comboActor.play(AsaInfo.combo.anim.combo, 0, false, 1.0);
		this.opacity = 1;
		this.modified();
		const timeline = this.scene.game.vars.scenedata.timeline;
		const tweenLabel: tl.Tween = gameUtil.createTween(timeline, this.comboLabel);
		tweenLabel.wait(600).to({ opacity: 0 }, 1);
	}
}
