import { ImgBank } from "./loading";
import { Renderer } from "./renderer";
import { GameState } from "./gamestate";
import { RoomMap } from "./room_map";
import { Jays } from "./jays";
import { Timer } from "./timer";
import { Sprite } from "./sprite";

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
	const jays = new Jays(new Sprite(0, 20, 20, 20), 20, 20, canvas_W / 2 - 10, canvas_H / 2 - 20);
	gameState.jays = jays;

	//////////////// TEMPORARY ///////////////////

	// I'll describe the Sprites in a JSON file very soon,
	// These lines will be generated
	// If I used strings for keys instead of Directions, it's to make the collec types generics
	// (not only directions, but also electrocuted or burned for example)
	jays.sprite_collecs.set("DOWN", [new Sprite(0, 60, 20, 20, "DOWN"), new Sprite(20, 60, 20, 20, "DOWN"),
	new Sprite(40, 60, 20, 20, "DOWN"), new Sprite(60, 60, 20, 20, "DOWN"), new Sprite(80, 60, 20, 20, "DOWN")]);
	jays.sprite_collecs.set("LEFT", [new Sprite(0, 100, 20, 20, "LEFT"), new Sprite(20, 100, 20, 20, "LEFT"),
	new Sprite(40, 100, 20, 20, "LEFT"), new Sprite(60, 100, 20, 20, "LEFT"), new Sprite(80, 100, 20, 20, "LEFT")]);
	jays.sprite_collecs.set("RIGHT", [new Sprite(0, 140, 20, 20, "RIGHT"), new Sprite(20, 140, 20, 20, "RIGHT"),
	new Sprite(40, 140, 20, 20, "RIGHT"), new Sprite(60, 140, 20, 20, "RIGHT"), new Sprite(80, 140, 20, 20, "RIGHT")]);
	jays.sprite_collecs.set("UP", [new Sprite(0, 180, 20, 20, "UP"), new Sprite(20, 180, 20, 20, "UP"),
	new Sprite(40, 180, 20, 20, "UP"), new Sprite(60, 180, 20, 20, "UP"), new Sprite(80, 180, 20, 20, "UP")]);
	jays.sprite_collecs.set("MOTIONLESS", [new Sprite(0, 20, 20, 20, "MOTIONLESS"), new Sprite(20, 20, 20, 20, "MOTIONLESS"),
	new Sprite(40, 20, 20, 20, "MOTIONLESS"), new Sprite(60, 20, 20, 20, "MOTIONLESS")]);

	jays.head.sprite_collecs.set("HEAD", [new Sprite(0, 0, 20, 20, "HEAD"), new Sprite(20, 0, 20, 20, "HEAD"),
	new Sprite(40, 0, 20, 20, "HEAD"), new Sprite(60, 0, 20, 20, "HEAD")]);

	//////////////////////////////////////////////

	//let timerTest = new Timer("test", 1000); // Tick every 1 second
	//gameState.timers.push(timerTest);
	//gameState.get_timer("test").enable(); // Launch the timer, we can now count his ticks in the gameState.update function

	const timer_tear = new Timer('tear', gameState.jays.tear_delay);
	gameState.timers.push(timer_tear);
	const timer_sprites = new Timer('jays_sprites', 80);
	gameState.timers.push(timer_sprites);

	bank.preload(gameState);
	gameState.update();
}

function define_sprites() {

}

document.addEventListener("keydown", (event) => {
	const keyName = event.key;
	gameState.key_down(keyName);
}, false);

document.addEventListener("keyup", (event) => {
	const keyName = event.key;
	gameState.key_up(keyName);
}, false);