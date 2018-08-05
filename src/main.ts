import { ImgBank } from "./loading";
import { Renderer } from "./renderer";
import { GameState } from "./gamestate";
import { Map } from "./map";
import { Jays } from "./entity";
import { Timer } from "./timer";

export var canvas = document.querySelector('#canvas') as HTMLCanvasElement;
export var canvas_W = 640;
export var canvas_H = 480;
export var ctx = canvas.getContext('2d');
export var bank = new ImgBank();
export var renderer = new Renderer();
export var gameState = new GameState(new Map(0));

window.onload = function () {
    main();
}

/**
 * TODO: See warp.js, collision.js
 */

function main() {
    let jays = new Jays(20, 40, canvas_W / 2 - 10, canvas_H / 2 - 20);
    gameState.jays = jays;

    //let timerTest = new Timer('test', 1000); // Tick every 1 second
    //gameState.timers.push(timerTest);
    //gameState.get_timer('test').enable(); // Launch the timer, we can now count his ticks in the gameState.update function

    let timer_tear = new Timer('tear', gameState.jays.tear_delay);
    gameState.timers.push(timer_tear);

    bank.preload(gameState);
    gameState.update();
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    gameState.key_down(keyName);
}, false);

document.addEventListener('keyup', (event) => {
    const keyName = event.key;
    gameState.key_up(keyName);
}, false);