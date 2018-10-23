import { AsaInfo } from "./asaInfo";

/**
 * ゲーム関連の静的情報
 */
export namespace define {
	/** 制限時間[秒] */
	export const GAME_TIME = 60;
	/** このゲームが許容する最長の制限時間[秒] */
	export const GAME_TIME_MAX = 99;
	/** 残り時間警告が始まる残り時間[秒]（この時間未満になった時に始まる） */
	export const CAUTION_TIME_CONDITION = 6;
	/** 初期ライフ数 */
	export const GAME_LIFE = 4;

	/** 横解像度を480から640に変更した際のX座標オフセット値 */
	export const OFFSET_X = (640 - 480) / 2;
	/** ゲーム中の数字の桁数 */
	export const GAME_TIMER_DIGIT = 2;
	/** ゲーム中の数字のX座標 */
	export const GAME_TIMER_X = 64 + define.OFFSET_X;
	/** ゲーム中の数字のY座標 */
	export const GAME_TIMER_Y = 5;
	/** ハート用の数字の桁数 */
	export const GAME_LIFE_DIGIT = 1;
	/** ハート用の数字のX座標 */
	export const GAME_LIFE_X = 454;
	/** ハート用の数字のY座標 */
	export const GAME_LIFE_Y = 3;
	/** ポイント用の数字の桁数 */
	export const GAME_SCORE_DIGIT = 5;
	/** ポイント用の数字のX座標 */
	export const GAME_SCORE_X = 426;
	/** ポイント用の数字のY座標 */
	export const GAME_SCORE_Y = 5;

	/** UIアイコン（時計）のX座標 */
	export const ICON_T_X = 2 + define.OFFSET_X;
	/** UIアイコン（時計）のY座標 */
	export const ICON_T_Y = 2;
	/** UIアイコン（ハート）のX座標 */
	export const ICON_H_X = 388;
	/** UIアイコン（ハート）のY座標 */
	export const ICON_H_Y = 0;
	/** UIアイコン（pt）のX座標 */
	export const ICON_PT_X = 451;
	/** UIアイコン（pt）のY座標 */
	export const ICON_PT_Y = 5;

	/** ゲーム固有 */
	/** アイコン（強）のX座標 */
	export const ICON_MAX_X = 13 + define.OFFSET_X;
	/** アイコン（強）のY座標 */
	export const ICON_MAX_Y = 42;
	/** アイコン（弱）のX座標 */
	export const ICON_MIN_X = 13 + define.OFFSET_X;
	/** アイコン（弱）のY座標 */
	export const ICON_MIN_Y = 320;
	/** ゲージのX座標 */
	export const UI_GAUGE_X = 5 + define.OFFSET_X;
	/** ゲージのY座標 */
	export const UI_GAUGE_Y = 73;
	/** 矢印のX座標 */
	export const UI_ARROW_X = 5 + define.OFFSET_X;
	/** 矢印のY座標 */
	export const UI_ARROW_Y = 65;
	/** コンボ数のX座標 */
	export const UI_COMBO_X = 240 + define.OFFSET_X;
	/** コンボ数のY座標 */
	export const UI_COMBO_Y = 103;
	/** レアが必ず出現する秒数 */
	export const RARE_APPEAR = 15;
	/** heartのX座標 */
	export const ICON_HEART1_X = 130;
	/** heartのY座標 */
	export const ICON_HEART_Y = 5;
	/** 体力 */
	export const DEFAULT_LIFE = 4;
	/** 矢印速度(一秒に上下する幅) */
	export const GAUGE_SPEED = 8;
	/** 何秒毎にアイテムを置くか */
	export const ITEM_ADD_TIME = 2;
	/** 腕が頭にぶつかるタイミングのフレーム数 */
	export const ARM_HIT_FRAME = 10;
	/** コンボボーナスの基礎値 */
	export const BASE_BONUS = 0.1;
	/** 得点の桁数 */
	export const GET_POINT_DIGIT = 4;
	/** 得点の表示位置X */
	export const GET_POINT_X = 240 + define.OFFSET_X;
	/** 得点の表示位置Y */
	export const GET_POINT_Y = 53;
	/** 失敗ペナルティ待機 */
	export const PENALTY_WAIT_TIME = 60;
	/** レアアイテム(ゲージアイコン用) */
	export const ITEM_KIND_RARE = 99;
	/** スコア上限 */
	export const SCORE_LIMIT: number = Math.pow(10, GAME_SCORE_DIGIT) - 1;

	/** アイテムの種類 */
	export enum Item {
		/** 卵 */
		EGG,
		/** リンゴ */
		APPLE,
		/** バナナ */
		BANANA,
		/** スイカ */
		SUIKA,
		/** 丸太 */
		WOOD,
		/** テレビ */
		TV,
		/** 宝箱 */
		BOX
	}
	/** アイテムの確率テーブル */
	export const ITEM_TABLE: number[] = [
		15, // 卵
		50, // リンゴ
		35, // バナナ
		30, // スイカ
		20, // 丸太
		78, // テレビ
		10 // 宝箱
	];
	/** アイテムの基礎ポイント */
	export const ITEM_BASE_POINT: number[] = [
		210, // 卵
		100, // リンゴ
		160, // バナナ
		250, // スイカ
		350, // 丸太
		450, // テレビ
		2000 // 宝箱
	];
	/** ゲージ速度加算分 */
	export const GAUGE_SPEED_ADD: number[] = [
		2,  // 卵
		-1, // リンゴ
		0,  // バナナ
		3,  // スイカ
		4,  // 丸太
		6,  // テレビ
		8   // 宝箱
	];
	/** 割る力のレベル */
	export enum PowerLevel {
		LEVEL_WEEK,
		LEVEL_SOFT,
		LEVEL_OK_MIN,
		LEVEL_CRITICAL,
		LEVEL_OK_MAX,
		LEVEL_STRONG,
		LEVEL_PUNCH
	}
	/** 割る力ゲージテーブル [アイテム][割る力のレベル] */
	export const ITEM_GAUGE_SCALE: number[][] = [
		[10, 15, 20, 25, 30, 40, 100], // 卵
		[25, 35, 40, 45, 54, 60, 100], // リンゴ
		[20, 25, 30, 35, 42, 50, 100], // バナナ
		[45, 50, 53, 57, 62, 70, 100], // スイカ
		[55, 60, 63, 68, 72, 80, 100], // 丸太
		[70, 75, 78, 81, 87, 88, 100], // テレビ
		[80, 85, 87, 89, 91, 95, 100]  // 宝箱
	];
	/** ゲージアイコンY座標 enum順 */
	export const GAUGE_ICON_Y: number[] = [
		160, // 卵
		100, // リンゴ
		137, // バナナ
		80, // スイカ
		52, // 丸太
		15, // テレビ
		2 // 宝箱
	];
	/** ゲージ倍率 */
	export const GAUGE_MAGNIFICATION: number[] = [0, 0.5, 1, 2, 1, 0.5, 0];
	/** ゲージアイコン非表示タイミング(秒) */
	export const GAUGE_ICON_HIDE: number = 20;
	/** アイテムX座標 */
	export const ITEM_X = 240 + define.OFFSET_X;
	/** アイテムY座標 */
	export const ITEM_Y = 183;
	/** アイテム種類増加のインターバル */
	export const ITEM_KIND_INTERVAL = 6;

	/** クリティカルアニメアセット短縮 */
	const efAnimBase = AsaInfo.ef.anim;
	/** クリティカル時のアニメ名配列 */
	export const CRITICAL_ANIM: string[] = [
		efAnimBase.critical1,
		efAnimBase.critical2,
		efAnimBase.critical3,
		efAnimBase.critical4,
		efAnimBase.critical5,
		efAnimBase.critical6,
		efAnimBase.critical7
	];

	/** アイテムアニメアセット短縮 */
	const itemAnimBase = AsaInfo.item.anim;
	/** アイテムのアニメ名配列 */
	export const ITEM_ANIM: string[][] = [
		[
			itemAnimBase.eggHit1,
			itemAnimBase.eggHit2,
			itemAnimBase.eggHit3,
			itemAnimBase.eggHit3,
			itemAnimBase.eggHit3,
			itemAnimBase.eggHit4,
			itemAnimBase.eggHit5,
			itemAnimBase.eggIdle
		], [
			itemAnimBase.appleHit1,
			itemAnimBase.appleHit2,
			itemAnimBase.appleHit3,
			itemAnimBase.appleHit3,
			itemAnimBase.appleHit3,
			itemAnimBase.appleHit4,
			itemAnimBase.appleHit5,
			itemAnimBase.appleIdle
		], [
			itemAnimBase.bananaHit1,
			itemAnimBase.bananaHit2,
			itemAnimBase.bananaHit3,
			itemAnimBase.bananaHit3,
			itemAnimBase.bananaHit3,
			itemAnimBase.bananaHit4,
			itemAnimBase.bananaHit5,
			itemAnimBase.bananaIdle
		], [
			itemAnimBase.suikaHit1,
			itemAnimBase.suikaHit2,
			itemAnimBase.suikaHit3,
			itemAnimBase.suikaHit3,
			itemAnimBase.suikaHit3,
			itemAnimBase.suikaHit4,
			itemAnimBase.suikaHit5,
			itemAnimBase.suikaIdle
		], [
			itemAnimBase.woodHit1,
			itemAnimBase.woodHit2,
			itemAnimBase.woodHit3,
			itemAnimBase.woodHit3,
			itemAnimBase.woodHit3,
			itemAnimBase.woodHit4,
			itemAnimBase.woodHit5,
			itemAnimBase.woodIdle
		], [
			itemAnimBase.tvHit1,
			itemAnimBase.tvHit2,
			itemAnimBase.tvHit3,
			itemAnimBase.tvHit3,
			itemAnimBase.tvHit3,
			itemAnimBase.tvHit4,
			itemAnimBase.tvHit5,
			itemAnimBase.tvIdle
		], [
			itemAnimBase.boxHit1,
			itemAnimBase.boxHit2,
			itemAnimBase.boxHit3,
			itemAnimBase.boxHit3,
			itemAnimBase.boxHit3,
			itemAnimBase.boxHit4,
			itemAnimBase.boxHit5,
			itemAnimBase.boxIdle
		]
	];

	/** 顔アニメアセット短縮 */
	const faceAnimBase = AsaInfo.face.anim;
	/** 顔のアニメ名配列 */
	export const FACE_ANIM: string[][] = [
		[
			faceAnimBase.face05Idle,
			faceAnimBase.face05Idle,
			faceAnimBase.face05Idle,
			faceAnimBase.face05Idle,
			faceAnimBase.face05Idle,
			faceAnimBase.face05Hit5,
			faceAnimBase.face05Hit5,
			faceAnimBase.face05Idle
		], [
			faceAnimBase.face04Hit1,
			faceAnimBase.face04Hit2,
			faceAnimBase.face04Hit3,
			faceAnimBase.face04Hit3,
			faceAnimBase.face04Hit3,
			faceAnimBase.face04Hit4,
			faceAnimBase.face04Hit5,
			faceAnimBase.face04Idle
		], [
			faceAnimBase.face03Hit1,
			faceAnimBase.face03Hit2,
			faceAnimBase.face03Hit3,
			faceAnimBase.face03Hit3,
			faceAnimBase.face03Hit3,
			faceAnimBase.face03Hit4,
			faceAnimBase.face03Hit5,
			faceAnimBase.face03Idle
		], [
			faceAnimBase.face02Hit1,
			faceAnimBase.face02Hit2,
			faceAnimBase.face02Hit3,
			faceAnimBase.face02Hit3,
			faceAnimBase.face02Hit3,
			faceAnimBase.face02Hit4,
			faceAnimBase.face02Hit5,
			faceAnimBase.face02Idle
		], [
			faceAnimBase.face01Hit1,
			faceAnimBase.face01Hit2,
			faceAnimBase.face01Hit3,
			faceAnimBase.face01Hit3,
			faceAnimBase.face01Hit3,
			faceAnimBase.face01Hit4,
			faceAnimBase.face01Hit5,
			faceAnimBase.face01Idle
		]
	];
}
