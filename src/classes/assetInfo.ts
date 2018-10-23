/**
 * 画像アセット関連の静的情報
 */
export class AssetInfo {
	// tslint:disable-next-line:typedef
	static numBlack = {  // ゲーム中の数字（黒）
		img: "img_numbers_n",
		json: "json_numbers_n",
		numFrames: [
			"numbers_n_10.png",
			"numbers_n_01.png",
			"numbers_n_02.png",
			"numbers_n_03.png",
			"numbers_n_04.png",
			"numbers_n_05.png",
			"numbers_n_06.png",
			"numbers_n_07.png",
			"numbers_n_08.png",
			"numbers_n_09.png"
		],
		nonnumFrames: [
			{ char: "*", frame: "numbers_n_11.png" },
			{ char: "+", frame: "numbers_n_12.png" },
			{ char: "-", frame: "numbers_n_13.png" }
		],
		missing: "numbers_n_13.png",
		frames: {
			cross: "numbers_n_11.png",
			plus: "numbers_n_12.png",
			minus: "numbers_n_13.png"
		},
		fontWidth: 26,
		fontHeight: 30
	};
	// tslint:disable-next-line:typedef
	static numRed = {  // ゲーム中の数字（赤）
		img: "img_numbers_n_red",
		json: "json_numbers_n_red",
		numFrames: [
			"numbers_n_red_10.png",
			"numbers_n_red_01.png",
			"numbers_n_red_02.png",
			"numbers_n_red_03.png",
			"numbers_n_red_04.png",
			"numbers_n_red_05.png",
			"numbers_n_red_06.png",
			"numbers_n_red_07.png",
			"numbers_n_red_08.png",
			"numbers_n_red_09.png"
		],
		nonnumFrames: [
			{ char: "*", frame: "numbers_n_red_11.png" },
			{ char: "+", frame: "numbers_n_red_12.png" },
			{ char: "-", frame: "numbers_n_red_13.png" }
		],
		missing: "numbers_n_red_13.png",
		frames: {
			cross: "numbers_n_red_11.png",
			plus: "numbers_n_red_12.png",
			minus: "numbers_n_red_13.png"
		},
		fontWidth: 26,
		fontHeight: 30
	};
	// tslint:disable-next-line:typedef
	static numWg = {  // 数字（gorilla）
		img: "img_wg_num",
		json: "json_wg_num",
		numFrames: [
			"num_W_export0001.png",
			"num_W_export0002.png",
			"num_W_export0003.png",
			"num_W_export0004.png",
			"num_W_export0005.png",
			"num_W_export0006.png",
			"num_W_export0007.png",
			"num_W_export0008.png",
			"num_W_export0009.png",
			"num_W_export0010.png"
		],
		frames: {
			cross: "num_W_export0011.png",
			plus: "num_W_export0012.png",
			minus: "num_W_export0013.png"
		},
		fontWidth: 26,
		fontHeight: 30
	};
	// tslint:disable-next-line:typedef
	static numCombo = {  // 数字（コンボ）
		img: "img_wg_num_cb_json",
		json: "json_wg_num_cb_json",
		numFrames: [
			"num_Cb_export0001.png",
			"num_Cb_export0002.png",
			"num_Cb_export0003.png",
			"num_Cb_export0004.png",
			"num_Cb_export0005.png",
			"num_Cb_export0006.png",
			"num_Cb_export0007.png",
			"num_Cb_export0008.png",
			"num_Cb_export0009.png",
			"num_Cb_export0010.png"
		],
		frames: {
			cross: "num_Cb_export0011.png",
			plus: "num_Cb_export0012.png",
			minus: "num_Cb_export0013.png"
		},
		fontWidth: 26,
		fontHeight: 30
	};
	// tslint:disable-next-line:typedef
	static ui = {
		img: "img_wg_ui",
		json: "json_wg_ui",
		frames: {
			iconClock: "icon_clock_export.png",  // アイコン（時計）
			iconHeart: "icon_heart_export.png",  // アイコン（ハート）
			iconPt: "icon_pt.png",  // アイコン（pt）
			uiGauge: "gage.png",  // ゲージ
			uiArrow: "wg_ui_arrow.png",  // ゲージ用矢印
			iconMax: "gage_ui_max.png",  // アイコン（強）
			iconMin: "gage_ui_min.png",  // アイコン（弱）
			gaugeIcon1: "wg_gage_item0001.png", // ゲージアイコン
			gaugeIcon2: "wg_gage_item0002.png",
			gaugeIcon3: "wg_gage_item0003.png",
			gaugeIcon4: "wg_gage_item0004.png",
			gaugeIcon5: "wg_gage_item0005.png",
			gaugeIcon6: "wg_gage_item0006.png"
		}
	};
}
