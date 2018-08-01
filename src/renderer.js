class Renderer {
    constructor() {}

    render_map(map) {
        for(let i = 0; i < map.height; i++) {
            for(let j = 0; j < map.width; j++) {
                let tile = map.tiles[i][j];
                ctx.drawImage(bank.pic["assets/img/tiles.png"],
                              tile.src_y*tile.height, tile.src_x*tile.width, tile.width, tile.height,
                              tile.pos_x, tile.pos_y, tile.width, tile.height);
            }
        }
    }

    // Too repetitive. We probably won't continue this way...

    render_jays() {
        let jays = gameState.jays;
        ctx.drawImage(bank.pic[jays.sprite_filename],
                      0, 0, jays.width, jays.height,
                      jays.pos_x, jays.pos_y, jays.width, jays.height);
    }

    render_tear(tear) {
        ctx.drawImage(bank.pic[tear.sprite_filename],
                      0, 0, tear.width, tear.height,
                      tear.pos_x, tear.pos_y, tear.width, tear.height);
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