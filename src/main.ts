import { GameState } from "./gamestate";
import { ImageBank } from "./image_bank";
import { Renderer } from "./renderer";
import { KeyMapper } from "./settings/keymapper";
import { Settings } from "./settings/settings";

export const canvas_W = 660;
export const canvas_H = 480;

export const static_canvas = document.getElementById("static-canvas") as HTMLCanvasElement;
export const static_ctx = static_canvas.getContext("2d", { alpha: false });

export const dynamic_canvas = document.getElementById("dynamic-canvas") as HTMLCanvasElement;
export const dynamic_ctx = dynamic_canvas.getContext("2d", { alpha: true });

export const main_layers: Array<{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }> = [
	{ canvas: static_canvas, ctx: static_ctx },
	{ canvas: dynamic_canvas, ctx: dynamic_ctx }
];

export const minimap_canvas = document.getElementById("minimap-canvas") as HTMLCanvasElement;
export const minimap_ctx = minimap_canvas.getContext("2d", { alpha: true });

export const IMAGE_BANK = new ImageBank();
export const renderer = new Renderer();
export let gameState: GameState;

//TODO: add a localstorage service to retrieve the value the user wants to use
export const key_mapper = new KeyMapper();

window.onload = () => {
	IMAGE_BANK.load_images().then(() => {
		renderer.autoScale();
		gameState = new GameState();
		Settings.init();
		gameState.get_timer("tear").interval = gameState.jays.tear_delay;
		gameState.update();
	});
};
