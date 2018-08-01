var canvas  = document.querySelector('#canvas');
var canvas_W = 640;
var canvas_H = 480;
var ctx = canvas.getContext('2d');
var bank = new ImgBank();
var renderer = new Renderer();
var gameState = new GameState(new Map(0));

window.onload = function() {
    main();
}

function main() {
    let jays = new Jays(20, 40, canvas_W/2-10, canvas_H/2-20);
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