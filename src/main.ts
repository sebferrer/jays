import { ImageBank } from "./image_bank";
import { Renderer } from "./renderer";
import { GameState } from "./gamestate";
import { Settings } from "./settings/settings";
import { KeyMapper } from "./settings/keymapper";

export const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
export const canvas_W = 660;
export const canvas_H = 480;
export const ctx = canvas.getContext("2d");
export const bank = new ImageBank();
export const renderer = new Renderer();
export const gameState = new GameState();

//TODO: add a localstorage service to retrieve the value the user wants to use
export const key_mapper = new KeyMapper();

window.onload = () => {
	main();
};

function main(): void {
	renderer.scale(1);

	Settings.init();

	gameState.get_timer("tear").interval = gameState.jays.tear_delay;
	bank.preload(gameState);
	gameState.update();
}