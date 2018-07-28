window.requestAnimFrame = (function() {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback) {
               window.setTimeout(callback, 1000 / 60);
           };
})();

function render_map(map) {
    for(let i = 0; i < map.height; i++) {
        for(let j = 0; j < map.width; j++) {
            let tile = map.tiles[i][j];
            ctx.drawImage(bank.pic["assets/img/tiles.png"], tile.coord_y*tile.height, tile.coord_x*tile.width, tile.height, tile.width, j*tile.width, i*tile.height, tile.width, tile.height);
        }
    }
}

function update() {
	ctx.save();
    ctx.clearRect(0, 0, canvas_W, canvas_H);

    render_map(gameState.current_map);
	
	ctx.restore();
	
	window.requestAnimFrame(function() { update() });
}