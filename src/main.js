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
    //let jays = new Jays(50, 100);
    //let blob = new Blob(50, 50);
    bank.preload(renderer);
    renderer.update();
}