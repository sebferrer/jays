class Renderer {
    constructor() {}

    render_map(map) {
        for(let i = 0; i < map.height; i++) {
            for(let j = 0; j < map.width; j++) {
                let tile = map.tiles[i][j];
                ctx.drawImage(bank.pic["assets/img/tiles.png"],
                              tile.coord_y*tile.height, tile.coord_x*tile.width, tile.width, tile.height,
                              j*tile.width, i*tile.height, tile.width, tile.height);
            }
        }
    }

    render_jays() {
        let jays = gameState.jays;
        ctx.drawImage(bank.pic[gameState.jays.sprite_filename],
                      0, 0, jays.width, jays.height,
                      jays.pos_x, jays.pos_y, jays.width, jays.height);
    }
    
}

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback) {
               window.setTimeout(callback, 1000 / 60);
           };
})();