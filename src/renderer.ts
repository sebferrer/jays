import { gameState, ctx, bank } from "./main";
import { Map } from "./map";

export class Renderer {
    constructor() { }

    public render_map(map: Map): void {
        for (let i = 0; i < map.height; i++) {
            for (let j = 0; j < map.width; j++) {
                let tile = map.tiles[i][j];
                ctx.drawImage(bank.pic["assets/img/tiles.png"],
                    tile.src_x * tile.height, tile.src_y * tile.width, tile.width, tile.height,
                    tile.pos_x, tile.pos_y, tile.width, tile.height);
            }
        }
    }

    // Too repetitive. We probably won't continue this way...

    public render_jays(): void {
        let jays = gameState.jays;
        ctx.drawImage(bank.pic[jays.sprite_filename],
            0, 0, jays.width, jays.height,
            jays.pos_x, jays.pos_y, jays.width, jays.height);
    }

    public render_tear(tear): void {
        ctx.drawImage(bank.pic[tear.sprite_filename],
            0, 0, tear.width, tear.height,
            tear.pos_x, tear.pos_y, tear.width, tear.height);
    }

}

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window["mozRequestAnimationFrame"] ||
        window["oRequestAnimationFrame"] ||
        window["msRequestAnimationFrame"] ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();