import { gameState, ctx, bank } from "./main";
import { RoomMap } from "./room_map";

export class Renderer {
	constructor() { }

	public render_map(map: RoomMap): void {
		for (let i = 0; i < map.height; i++) {
			for (let j = 0; j < map.width; j++) {
				const tile = map.tiles[i][j];
				ctx.drawImage(bank.pic["assets/img/tiles.png"],
					tile.src_x * tile.height, tile.src_y * tile.width, tile.width, tile.height,
					tile.pos_x, tile.pos_y, tile.width, tile.height);
			}
		}
	}

	public render_jays(): void {
		const jays = gameState.jays;
		ctx.drawImage(bank.pic[jays.sprite_filename],
			jays.current_sprite.src_x, jays.current_sprite.src_y, jays.current_sprite.src_width, jays.current_sprite.src_height,
			jays.pos_x, jays.pos_y, jays.width, jays.height);
		ctx.drawImage(bank.pic[jays.sprite_filename],
			jays.head.current_sprite.src_x, jays.head.current_sprite.src_y, jays.head.current_sprite.src_width, jays.head.current_sprite.src_height,
			jays.head.pos_x, jays.head.pos_y, jays.head.width, jays.head.height);
	}

	public render_tear(tear): void {
		ctx.drawImage(bank.pic[tear.sprite_filename],
			tear.current_sprite.src_x, tear.current_sprite.src_y, tear.current_sprite.src_width, tear.current_sprite.src_height,
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