/**
 * 難易度設定データの型
 */
export interface DifficultyParameter {
	/** このパラメータが適用される難易度の最小値 */
	minimumDifficulty: number;

	/** 矢印速度(一秒に上下する幅) */
	gaugeSpeed?: number;
	/** ゲージ速度加算分 */
	gaugeSpeedAdd?: number[];
}

/**
 * 難易度設定データJSONの型
 */
export interface DifficultyParametersJson {
	/**
	 * 難易度設定データの配列
	 * minimumDifficultyが小さいものから並べる
	 */
	difficultyParameterList: DifficultyParameter[];
}
