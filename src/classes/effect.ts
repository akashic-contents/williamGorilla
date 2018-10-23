import * as tl from "@akashic-extension/akashic-timeline";
import { define } from "./define";
import { AsaInfo } from "./asaInfo";
import { entityUtil } from "../util/entityUtil";
import { gameUtil } from "../util/gameUtil";
import { asaEx } from "../util/asaEx";

/**
 * エフェクトの管理、表示を行うクラス
 */
export class Effect extends g.E {
	/** 擬音 */
	private actorGion: asaEx.Actor = null;
	/** キラキラ */
	private actorKira: asaEx.Actor = null;
	/** 集中線 */
	private actorILine: asaEx.Actor = null;
	/** クリティカル */
	private actorCritical: asaEx.Actor = null;

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
		const centerW = this.scene.game.width / 2;
		const centerH = this.scene.game.height / 2;
		// 各エフェクトを生成して非表示にしておく
		const actor: asaEx.Actor = new asaEx.Actor(this.scene, AsaInfo.ef.pj);
		entityUtil.setXY(actor, centerW, centerH);
		this.actorGion = actor;
		this.actorGion.ended.handle(this, (): void => {
			this.scene.setTimeout(1, this, (): void => {
				entityUtil.hideEntity(this.actorGion);
			});
		});
		this.append(this.actorGion);
		entityUtil.hideEntity(this.actorGion);

		const actor1: asaEx.Actor = new asaEx.Actor(this.scene, AsaInfo.ef.pj);
		actor1.play(AsaInfo.ef.anim.kira, 0, true, 1);
		entityUtil.setXY(actor1, centerW, centerH);
		this.actorKira = actor1;
		this.append(this.actorKira);
		entityUtil.hideEntity(this.actorKira);

		const actor2: asaEx.Actor = new asaEx.Actor(this.scene, AsaInfo.ef.pj);
		actor2.play(AsaInfo.ef.anim.iline, 0, true, 1);
		entityUtil.setXY(actor2, centerW, centerH);
		this.actorILine = actor2;
		this.append(this.actorILine);
		entityUtil.hideEntity(this.actorILine);

		const actor3: asaEx.Actor = new asaEx.Actor(this.scene, AsaInfo.ef.pj);
		actor3.play(AsaInfo.ef.anim.critical1, 0, true, 1);
		entityUtil.setXY(actor3, centerW, centerH);
		this.actorCritical = actor3;
		this.append(this.actorCritical);
		entityUtil.hideEntity(this.actorCritical);
	}

	/**
	 * タップ時の効果チェック
	 * @param {number} _level 割る力のレベル
	 * @param {number} _kind  アイテム種類
	 */
	checkActionEffect(_level: number, _kind: number): void {
		// 割る強さがちょうどよいレベル
		if (_level >= define.PowerLevel.LEVEL_OK_MIN && _level <= define.PowerLevel.LEVEL_OK_MAX) {
			// 集中線
			this.setIline();
			// 擬音:スパっ
			this.setGion(true);
			// キラキラ
			this.setKira();
			if (_level === define.PowerLevel.LEVEL_CRITICAL) {
				this.setCritical(_kind);
			}
		} else if (_level > define.PowerLevel.LEVEL_OK_MAX) {
			// 擬音:ぼこ
			this.setGion(false);
		}
	}

	/**
	 * アニメ非表示
	 */
	endAnim(): void {
		entityUtil.hideEntity(this.actorILine);
		entityUtil.hideEntity(this.actorGion);
		entityUtil.hideEntity(this.actorKira);
		entityUtil.hideEntity(this.actorCritical);
	}

	/**
	 * 毎フレームの更新処理
	 */
	onUpdate(): void {
		this.actorGion.modified();
		this.actorGion.calc();
		this.actorKira.modified();
		this.actorKira.calc();
		this.actorILine.modified();
		this.actorILine.calc();
		this.actorCritical.modified();
		this.actorCritical.calc();
	}

	/**
	 * 集中線アニメ再生
	 */
	private setIline(): void {
		entityUtil.showEntity(this.actorILine);
		// 指定した時間ループ＞非表示
		this.actorILine.play(AsaInfo.ef.anim.iline, 0, true, 1);
		const timeline: tl.Timeline = this.scene.game.vars.scenedata.timeline;
		const tweenIline = gameUtil.createTween(timeline, this.actorILine);
		tweenIline.wait((30 * 1000) / g.game.fps).call(function() {
			entityUtil.hideEntity(this);
		});
	}

	/**
	 * 擬音アニメ再生
	 * @param {boolean} _isSuccess 成功した
	 */
	private setGion(_isSuccess: boolean): void {
		entityUtil.showEntity(this.actorGion);
		let animname: string = "";
		if (_isSuccess === true) {
			animname = AsaInfo.ef.anim.gionSupa;
		} else {
			animname = AsaInfo.ef.anim.gionBoko;
		}
		// 1回再生＞非表示
		this.actorGion.play(animname, 0, false, 1);
	}

	/**
	 * キラキラアニメ再生
	 */
	private setKira(): void {
		entityUtil.showEntity(this.actorKira);
		// 指定した時間ループ＞非表示
		this.actorKira.play(AsaInfo.ef.anim.kira, 0, true, 1);
		const timeline: tl.Timeline = this.scene.game.vars.scenedata.timeline;
		const tweenKira = gameUtil.createTween(timeline, this.actorKira);
		tweenKira.wait((30 * 1000) / g.game.fps).call(function() {
			entityUtil.hideEntity(this);
		});
	}

	/**
	 * クリティカルのeffectアニメ再生
	 * @param {number} _kind アイテム種類
	 */
	private setCritical(_kind: number): void {
		entityUtil.showEntity(this.actorCritical);
		// アイテム種類によってcriticalアニメ変化
		const animname: string = define.CRITICAL_ANIM[_kind];
		this.actorCritical.play(animname, 0, true, 1);
		const timeline: tl.Timeline = this.scene.game.vars.scenedata.timeline;
		const tweenCri = gameUtil.createTween(timeline, this.actorCritical);
		tweenCri.wait((30 * 1000) / g.game.fps).call(function() {
			entityUtil.hideEntity(this);
		});
	}
}
