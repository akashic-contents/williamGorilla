import { define } from "./define";
import { AssetInfo } from "./assetInfo";
import { entityUtil } from "../util/entityUtil";
import { spriteUtil } from "../util/spriteUtil";

/**
 * ゲージに表示されるアイテムアイコンの管理、表示を行うクラス
 */
export class GaugeIcon extends g.E {
	/** アイコンのスプライト配列 */
	private sprItem: g.Sprite[] = [];
	/** アイテム種類 */
	private kind: number = 0;

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
		const spoUi = spriteUtil.createSpriteParameter(AssetInfo.ui);
		const sfmUi = spriteUtil.createSpriteFrameMap(AssetInfo.ui);
		const lifeIcon1: g.Sprite = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.gaugeIcon1);
		entityUtil.setXY(lifeIcon1, 0, define.GAUGE_ICON_Y[0]);
		this.append(lifeIcon1);
		this.sprItem.push(lifeIcon1);

		const lifeIcon2: g.Sprite = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.gaugeIcon2);
		entityUtil.setXY(lifeIcon2, 2, define.GAUGE_ICON_Y[1]);
		this.append(lifeIcon2);
		this.sprItem.push(lifeIcon2);

		const lifeIcon3: g.Sprite = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.gaugeIcon3);
		entityUtil.setXY(lifeIcon3, 0, define.GAUGE_ICON_Y[2]);
		this.append(lifeIcon3);
		this.sprItem.push(lifeIcon3);

		const lifeIcon4: g.Sprite = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.gaugeIcon4);
		entityUtil.setXY(lifeIcon4, 0, define.GAUGE_ICON_Y[3]);
		this.append(lifeIcon4);
		this.sprItem.push(lifeIcon4);

		const lifeIcon5: g.Sprite = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.gaugeIcon5);
		entityUtil.setXY(lifeIcon5, 0, define.GAUGE_ICON_Y[4]);
		this.append(lifeIcon5);
		this.sprItem.push(lifeIcon5);

		const lifeIcon6: g.Sprite = spriteUtil.createFrameSprite(spoUi, sfmUi, AssetInfo.ui.frames.gaugeIcon6);
		entityUtil.setXY(lifeIcon6, 0, define.GAUGE_ICON_Y[5]);
		this.append(lifeIcon6);
		this.sprItem.push(lifeIcon6);
	}


	/**
	 * アイコン種類更新
	 * @param {number} _kind アイテム種類
	 */
	public setKind(_kind: number): void {
		this.kind = _kind;
		if (_kind > define.ITEM_TABLE.length - 1) {
			this.kind = define.ITEM_KIND_RARE;
		}
		this.switchIcon();
	}

	/**
	 * アイコン初期化(りんご)
	 */
	gameReset(): void {
		this.setKind(define.Item.APPLE);
	}

	/**
	 * アイコン表示更新
	 */
	private switchIcon(): void {
		const iconlength: number = this.sprItem.length;
		for (let i = 0; i < iconlength; ++i) {
			this.sprItem[i].hide();
			if (i === this.kind) {
				this.sprItem[i].show();
			}
			this.sprItem[i].modified();
		}
	}
}
