import { RireGameParameters } from "../commonNicowariGame/rireGameParameters";

/**
 * パラメータ
 */
export interface GameParameters extends RireGameParameters {
	/** 矢印速度(一秒に上下する幅) */
	gaugeSpeed?: number;
	/** ゲージ速度加算分 */
	gaugeSpeedAdd?: number[];
}
