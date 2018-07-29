class Renderer {
    constructor() {}

    render_map(map) {
        for(let i = 0; i < map.height; i++) {
            for(let j = 0; j < map.width; j++) {
                let tile = map.tiles[i][j];
                ctx.drawImage(bank.pic["assets/img/tiles.png"],
                              tile.coord_y*tile.height, tile.coord_x*tile.width, tile.height, tile.width,
                              j*tile.width, i*tile.height, tile.width, tile.height);
            }
        }
    }
    
    update() {
        ctx.save();
        ctx.clearRect(0, 0, canvas_W, canvas_H);
    
        try {
            this.render_map(gameState.current_map);
        } catch (err) {}
        
        ctx.restore();
        
        var self = this;
        window.requestAnimationFrame(function() { self.update() });
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