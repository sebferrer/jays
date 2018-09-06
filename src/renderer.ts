import { gameState, ctx, bank, canvas, canvas_W, canvas_H } from "./main";
import { RoomMap } from "./environment/room_map";
import { Wall, FloorOneRoom } from "./environment/wall";

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

	public render_wall() {
		const wall = new FloorOneRoom();

		// SIDES

		// TOP
		const topPic = bank.pic[wall.side_sprite.sprite_sheet_path];
		for (let i = 1; i < 10; ++i) {
			ctx.drawImage(topPic,
				wall.side_sprite.top_left.x,
				wall.side_sprite.top_left.y,
				wall.side_sprite.width, wall.side_sprite.height,
				i * wall.side_sprite.width, 0,
				wall.side_sprite.width,
				wall.side_sprite.height
			);
		}

		// LEFT
		const leftPic = bank.pic[wall.side_sprite.sprite_sheet_path];

		for (let i = 1; i < 7; ++i) {
			ctx.save();
			// Translate from center of picture
			ctx.translate(wall.side_sprite.width / 2, (i * wall.side_sprite.height + wall.side_sprite.height / 2));
			ctx.rotate(this.getRadians(-90));
			ctx.translate(- (wall.side_sprite.width / 2), -(i * wall.side_sprite.height + wall.side_sprite.height / 2));

			ctx.drawImage(leftPic,
				wall.side_sprite.top_left.x,
				wall.side_sprite.top_left.y,
				wall.side_sprite.width, wall.side_sprite.height,
				0, i * wall.side_sprite.height,
				wall.side_sprite.width,
				wall.side_sprite.height
			);

			ctx.restore();
		}

		// BOTTOM
		const bottomPic = bank.pic[wall.side_sprite.sprite_sheet_path];

		for (let i = 1; i < 10; ++i) {
			ctx.save();
			// Translate from center of picture
			ctx.translate((i * wall.side_sprite.width + wall.side_sprite.width / 2), canvas_H - wall.side_sprite.height / 2);
			ctx.rotate(this.getRadians(-180));
			ctx.translate(-(i * wall.side_sprite.width + wall.side_sprite.width / 2), -(canvas_H - wall.side_sprite.height / 2));

			ctx.drawImage(bottomPic,
				wall.side_sprite.top_left.x,
				wall.side_sprite.top_left.y,
				wall.side_sprite.width, wall.side_sprite.height,
				i * wall.side_sprite.width, canvas_H - wall.side_sprite.height,
				wall.side_sprite.width,
				wall.side_sprite.height
			);

			ctx.restore();
		}

		// RIGHT
		const right = bank.pic[wall.side_sprite.sprite_sheet_path];

		for (let i = 1; i < 7; ++i) {
			ctx.save();
			// Translate from center of picture
			ctx.translate(canvas_W - wall.side_sprite.width / 2, (i * wall.side_sprite.height + wall.side_sprite.height / 2));
			ctx.rotate(this.getRadians(90));
			ctx.translate(- (canvas_W - wall.side_sprite.width / 2), -(i * wall.side_sprite.height + wall.side_sprite.height / 2));

			ctx.drawImage(right,
				wall.side_sprite.top_left.x,
				wall.side_sprite.top_left.y,
				wall.side_sprite.width, wall.side_sprite.height,
				canvas_W - wall.side_sprite.width, i * wall.side_sprite.height,
				wall.side_sprite.width,
				wall.side_sprite.height
			);

			ctx.restore();
		}



		// CORNERS

		// Top left
		const topLeftPic = bank.pic[wall.corner_sprite.sprite_sheet_path];
		ctx.drawImage(topLeftPic,
			wall.corner_sprite.top_left.x,
			wall.corner_sprite.top_left.y,
			wall.corner_sprite.width, wall.corner_sprite.height,
			0, 0,
			wall.corner_sprite.width,
			wall.corner_sprite.height
		);

		// Bottom left
		const bottomLeftPic = bank.pic[wall.corner_sprite.sprite_sheet_path];
		ctx.save();
		// Translate from center of picture
		ctx.translate(wall.corner_sprite.width / 2, canvas_H - (wall.corner_sprite.height / 2));
		ctx.rotate(this.getRadians(-90));
		ctx.translate(-(wall.corner_sprite.width / 2), -(canvas_H - (wall.corner_sprite.height / 2)));

		ctx.drawImage(bottomLeftPic,
			wall.corner_sprite.top_left.x,
			wall.corner_sprite.top_left.y,
			wall.corner_sprite.width, wall.corner_sprite.height,
			0, canvas_H - wall.corner_sprite.height,
			wall.corner_sprite.width,
			wall.corner_sprite.height
		);
		ctx.restore();

		// Top right
		const topRightPic = bank.pic[wall.corner_sprite.sprite_sheet_path];
		ctx.save();
		// Translate from center of picture
		ctx.translate(canvas_W - (wall.corner_sprite.width / 2), wall.corner_sprite.height / 2);
		ctx.rotate(this.getRadians(90));
		ctx.translate(-(canvas_W - (wall.corner_sprite.width / 2)), -(wall.corner_sprite.height / 2));

		ctx.drawImage(topRightPic,
			wall.corner_sprite.top_left.x,
			wall.corner_sprite.top_left.y,
			wall.corner_sprite.width, wall.corner_sprite.height,
			canvas_W - wall.corner_sprite.width, 0,
			wall.corner_sprite.width,
			wall.corner_sprite.height
		);
		ctx.restore();

		// Bottom right
		const bottomRight = bank.pic[wall.corner_sprite.sprite_sheet_path];
		ctx.save();

		// Translate from center of picture
		ctx.translate(canvas_W - (wall.corner_sprite.width / 2), canvas_H - (wall.corner_sprite.height / 2));
		ctx.rotate(this.getRadians(180));
		ctx.translate(-(canvas_W - (wall.corner_sprite.width / 2)), -(canvas_H - (wall.corner_sprite.height / 2)));

		ctx.drawImage(bottomRight,
			wall.corner_sprite.top_left.x,
			wall.corner_sprite.top_left.y,
			wall.corner_sprite.width, wall.corner_sprite.height,
			canvas_W - wall.corner_sprite.width, canvas_H - wall.corner_sprite.height,
			wall.corner_sprite.width,
			wall.corner_sprite.height
		);
		ctx.restore();
	}

	private getRadians(angleInDegrees: number) {
		return angleInDegrees * Math.PI / 180;
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