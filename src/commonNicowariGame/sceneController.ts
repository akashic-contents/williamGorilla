/**
 * Sceneの生成と各種ハンドラ設定を行う抽象クラス
 * このクラスのインスタンスはcreateSceneで生成したSceneのTriggerなどから
 * 参照されることによって保持される。
 */
export abstract class SceneController {
	constructor() {
		// NOP
	}

	/**
	 * このクラスで処理するSceneを生成する
	 * onLoadを呼ぶScene#onLoadのハンドラをこの中で設定する
	 * @param {g.Game} _game Scene生成に使用するGame
	 * @return {g.Scene} 生成したScene
	 */
	abstract createScene(_game: g.Game): g.Scene;

	/**
	 * Scene#onLoadのハンドラ
	 * handleUpdateを呼ぶScene#onUpdateのハンドラをこの中で設定する
	 * @param {g.Scene} _scene 処理対象のScene
	 * @return {boolean} 通常trueを返し、ハンドラ設定を解除する
	 */
	protected abstract handleLoaded(_scene: g.Scene): boolean;

	/**
	 * Scene#onUpdateのハンドラ
	 * @param {g.Scene} _scene 処理対象のScene
	 * @return {boolean} 通常falseを返す
	 */
	protected abstract handleUpdate(_scene: g.Scene): boolean;
}
