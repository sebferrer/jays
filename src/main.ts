import { ImgBank } from "./loading";
import { Renderer } from "./renderer";
import { GameState } from "./gamestate";
import { RoomMap } from "./room_map";
import { Settings } from "./settings";
import { KeyMapper } from "./keymapper";

export const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
export const canvas_W = 640;
export const canvas_H = 480;
export const ctx = canvas.getContext("2d");
export const bank = new ImgBank();
export const renderer = new Renderer();
export const gameState = new GameState(new RoomMap(0));

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