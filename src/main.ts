import { ImageBank } from "./image_bank";
import { Renderer } from "./renderer";
import { GameState } from "./gamestate";
import { Settings } from "./settings/settings";
import { KeyMapper } from "./settings/keymapper";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export const canvas_W = 660;
export const canvas_H = 480;
export const ctx = canvas.getContext("2d", { alpha: false });

export const minimap_canvas = document.getElementById("minimap-canvas") as HTMLCanvasElement;
export const minimap_ctx = minimap_canvas.getContext("2d", { alpha: true });

export const IMAGE_BANK = new ImageBank();
export const renderer = new Renderer();
export let gameState: GameState;

//TODO: add a localstorage service to retrieve the value the user wants to use
export const key_mapper = new KeyMapper();

window.onload = () => {
	IMAGE_BANK.load_images().then(() => {
		gameState = new GameState();
		renderer.autoScale();
		Settings.init();
		gameState.get_timer("tear").interval = gameState.jays.tear_delay;
		gameState.update();
	});
};