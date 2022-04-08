import { CommonParameterReader } from "../commonNicowariGame/commonParameterReader";
import { DifficultyParametersJson, DifficultyParameter } from "./difficultyParameters";
import { GameParameters } from "./gameParameters";
import { MiscAssetInfo } from "./miscAssetInfo";
import { define } from "./define";

/**
 * ゲーム固有パラメータの読み込みクラス
 * 省略されたパラメータ項目の補完などを行う
 */
export class GameParameterReader {
	/** 矢印速度(一秒に上下する幅) */
	static gaugeSpeed: number;
	/** ゲージ速度加算分 */
	static gaugeSpeedAdd: number[];

	/**
	 * 起動パラメータから対応するメンバ変数を設定する
	 * @param {g.Scene} _scene Sceneインスタンス
	 */
	static read(_scene: g.Scene): void {
		this.gaugeSpeed = define.GAUGE_SPEED;
		this.gaugeSpeedAdd = define.GAUGE_SPEED_ADD;

		if (!CommonParameterReader.nicowari) {
			if (CommonParameterReader.useDifficulty) {
				// 難易度指定によるパラメータを設定
				this.loadFromJson(_scene);
			} else {
				const param: GameParameters = _scene.game.vars.parameters;
				if (this.checkGaugeSpeed(param.gaugeSpeed, param.gaugeSpeedAdd)) {
					this.gaugeSpeed = param.gaugeSpeed;
					this.gaugeSpeedAdd = param.gaugeSpeedAdd;
				}
			}
		}
	}

	/**
	 * JSONから難易度指定によるパラメータを設定
	 * @param {g.Scene} _scene Sceneインスタンス
	 */
	private static loadFromJson(_scene: g.Scene): void {
		const difficultyJson: DifficultyParametersJson
			= _scene.asset.getJSONContentById(MiscAssetInfo.difficultyData.name);
		const difficultyList: DifficultyParameter[]
			= difficultyJson.difficultyParameterList;
		if (difficultyList.length === 0) {
			return;
		}
		let index = 0;
		for (let i = difficultyList.length - 1; i >= 0; --i) {
			if (difficultyList[i].minimumDifficulty
				<= CommonParameterReader.difficulty) {
				index = i;
				// console.log("minimumDifficulty[" + i + "]:" + difficultyList[i].minimumDifficulty + ".");
				break;
			}
		}

		if (this.checkGaugeSpeed(difficultyList[index].gaugeSpeed, difficultyList[index].gaugeSpeedAdd)) {
			this.gaugeSpeed = difficultyList[index].gaugeSpeed;
			this.gaugeSpeedAdd = difficultyList[index].gaugeSpeedAdd;
		}
	}

	/**
	 * 使えるゲージスピードなのかチェック
	 * @param  {Object}  _base 基本スピード
	 * @param  {Object}  _add  加算スピード配列
	 * @return {boolean}       使えればtrue
	 */
	private static checkGaugeSpeed(_base: Object, _add: Object): boolean {
		if (typeof _base === "number" && // 数値型
			_base > 0 && // 0だと初期位置から動かない
			Array.isArray(_add) && // 配列で
			_add.length === 7) { // アイテムの種類分

			for (let i = 0; i < _add.length; ++i) {
				// 数値型でないなら使えない
				if (typeof _add[i] !== "number") return false;

				// 加算配列のマイナスによって最終速度が0以下になる場合
				// （0だとカーソル止まる、マイナスだとカーソル方向反転する）
				if (_base + _add[i] <= 0) {
					return false;
				}
			}
			return true;
		}
		return false;
	}
}
