import { ImgBank } from "./loading";
import { Renderer } from "./renderer";
import { GameState } from "./gamestate";
import { RoomMap } from "./room_map";
import { Jays } from "./jays";

export var canvas = document.querySelector("#canvas") as HTMLCanvasElement;
export var canvas_W = 640;
export var canvas_H = 480;
export var ctx = canvas.getContext("2d");
export var bank = new ImgBank();
export var renderer = new Renderer();
export var gameState = new GameState(new RoomMap(0));

window.onload = function () {
	main();
};

/**
 * TODO: See warp.js, collision.js
 */

function main() {
	gameState.jays = new Jays();

	gameState.get_timer("tear").interval = gameState.jays.tear_delay;

	bank.preload(gameState);
	gameState.update();
}

document.addEventListener("keydown", (event) => {
	const keyName = event.key;
	gameState.key_down(keyName);
}, false);

document.addEventListener("keyup", (event) => {
	const keyName = event.key;
	gameState.key_up(keyName);
}, false);