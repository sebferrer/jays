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
    //let blob = new Blob(50, 50);
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