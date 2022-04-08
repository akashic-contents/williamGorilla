import { entityUtil } from "../util/entityUtil";
import { asaEx } from "../util/asaEx";
import { AsaInfo } from "./asaInfo";
import { define } from "./define";

/**
 * 頭に乗せるアイテムの管理、表示を行うクラス
 */
export class CrushItem extends g.E {
	/** アイテム種類 */
	private kind: number = 0;
	/** アイテム */
	private actor: asaEx.Actor;

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
		const itemActor = new asaEx.Actor(this.scene, AsaInfo.item.pj);
		entityUtil.setXY(itemActor, define.ITEM_X, define.ITEM_Y);
		itemActor.ended.add((): void => {
			this.scene.setTimeout((): void => { entityUtil.hideEntity(this.actor); }, 1, this);
		}, this);
		this.actor = itemActor;

		entityUtil.hideEntity(this.actor);
		this.actor.modified();
		this.append(this.actor);
	}

	/**
	 * スタート[アイテム置く]
	 * @param {number} _kind アイテム種類
	 */
	startAnim(_kind: number): void {
		this.kind = _kind;
		const idleLevel: number = define.ITEM_ANIM[0].length - 1;
		entityUtil.showEntity(this.actor);
		const animname: string = define.ITEM_ANIM[this.kind][idleLevel];
		this.actor.play(animname, 0, true, 1);
		// console.log("item kind:"+_kind +" name:"+animname); // for debug
	}

	/**
	 * アイテム割れるアニメ分岐
	 * @param {number} _level 割る力のレベル
	 */
	setCrushAnim(_level: number): void {
		entityUtil.showEntity(this.actor);
		const animname: string = define.ITEM_ANIM[this.kind][_level];
		this.actor.play(animname, 0, false, 1);
	}
	/**
	 * アニメ終了(非表示)
	 */
	endAnim(): void {
		entityUtil.hideEntity(this.actor);
	}

	/**
	 * 毎フレームの更新処理
	 */
	handleUpdate(): void {
		// 更新
		this.actor.modified();
		this.actor.calc();
	}
}
