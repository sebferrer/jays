import { gameState, ctx, bank, canvas, canvas_W, canvas_H } from "./main";
import { RoomMap } from "./environment/room_map";

export class Renderer {
	public zoomScale: number;
	public zoomScaleNext: Map<number, number>;

	constructor() {
		this.zoomScale = 1;
		this.zoomScaleNext = new Map<number, number>([[1, 1.25], [1.25, 1.5], [1.5, 1.75], [1.75, 2], [2, 1]]);
	}

	public disableSmoothing(): void {
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}

	public scale(zoomScale?: number): void {
		this.zoomScale = zoomScale == null ? this.zoomScaleNext.get(this.zoomScale) : zoomScale;
		canvas.width = canvas_W * this.zoomScale;
		canvas.height = canvas_H * this.zoomScale;
		ctx.scale(this.zoomScale, this.zoomScale);
		this.disableSmoothing();
	}

	public autoScale(): void {
		const ratio = Math.round(window.innerHeight / canvas_H * 100) / 100;
		canvas.width = canvas_W * ratio;
		canvas.height = canvas_H * ratio;
		ctx.scale(ratio, ratio);
		this.disableSmoothing();
	}

	public render_map(room: RoomMap): void {
		for (let i = 0; i < room.height; i++) {
			for (let j = 0; j < room.width; j++) {
				const tile = room.tiles[i][j];
				ctx.drawImage(bank.pic["assets/img/tiles.png"],
					tile.src.x * tile.height, tile.src.y * tile.width, tile.width, tile.height,
					tile.pos.x, tile.pos.y, tile.width, tile.height);
			}
		}
	}

	public render_jays(): void {
		const jays = gameState.jays;
		ctx.drawImage(bank.pic[jays.sprite_filename],
			jays.current_sprite.src_x, jays.current_sprite.src_y, jays.current_sprite.src_width, jays.current_sprite.src_height,
			jays.pos.x, jays.pos.y, jays.width, jays.height);
		ctx.drawImage(bank.pic[jays.sprite_filename],
			jays.head.current_sprite.src_x, jays.head.current_sprite.src_y, jays.head.current_sprite.src_width, jays.head.current_sprite.src_height,
			jays.head.pos.x, jays.head.pos.y, jays.head.width, jays.head.height);
	}

	public render_tear(tear): void {
		ctx.drawImage(bank.pic[tear.sprite_filename],
			tear.current_sprite.src_x, tear.current_sprite.src_y, tear.current_sprite.src_width, tear.current_sprite.src_height,
			tear.pos.x, tear.pos.y, tear.width, tear.height);
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