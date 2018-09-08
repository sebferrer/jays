import { Point } from "../point";
import { WallSprite } from "./wall_sprite";
import { canvas_W, canvas_H, bank } from "../main";
import { IDrawable } from "../idrawable";

export abstract class RoomWalls implements IDrawable {
	protected _corner_sprite: WallSprite;
	public get corner_sprite(): WallSprite { return this._corner_sprite; }

	protected _side_sprite: WallSprite;
	public get side_sprite(): WallSprite { return this._side_sprite; }

	constructor(corner_sprite: WallSprite, side_sprite: WallSprite) {
		if (corner_sprite == null) {
			throw new Error("Parameter 'corner_sprite' cannot be null");
		}
		if (side_sprite == null) {
			throw new Error("Parameter 'side_sprite' cannot be null");
		}

		this._corner_sprite = corner_sprite;
		this._side_sprite = side_sprite;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		const sidePic = bank.pic[this.side_sprite.sprite_sheet_path];
		const cornerPic = bank.pic[this.corner_sprite.sprite_sheet_path];

		// SIDES

		// TOP
		for (let i = 1; i < 10; ++i) {
			ctx.drawImage(sidePic,
				this.side_sprite.top_left.x,
				this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				i * this.side_sprite.width, 0,
				this.side_sprite.width,
				this.side_sprite.height
			);
		}

		// LEFT
		for (let i = 1; i < 7; ++i) {
			ctx.save();
			this.corner_sprite.rotate(ctx, new Point(0, i * this.side_sprite.height), -90);
			ctx.drawImage(sidePic,
				this.side_sprite.top_left.x,
				this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				0, i * this.side_sprite.height,
				this.side_sprite.width,
				this.side_sprite.height
			);
			ctx.restore();
		}

		// BOTTOM
		for (let i = 1; i < 10; ++i) {
			ctx.save();
			this.corner_sprite.rotate(ctx, new Point(i * this.side_sprite.width, canvas_H - this.side_sprite.height), -180);
			ctx.drawImage(sidePic,
				this.side_sprite.top_left.x,
				this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				i * this.side_sprite.width, canvas_H - this.side_sprite.height,
				this.side_sprite.width,
				this.side_sprite.height
			);
			ctx.restore();
		}

		// RIGHT
		for (let i = 1; i < 7; ++i) {
			ctx.save();
			this.corner_sprite.rotate(ctx, new Point(canvas_W - this.side_sprite.width, i * this.side_sprite.height), 90);
			ctx.drawImage(sidePic,
				this.side_sprite.top_left.x,
				this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				canvas_W - this.side_sprite.width, i * this.side_sprite.height,
				this.side_sprite.width,
				this.side_sprite.height
			);
			ctx.restore();
		}

		// CORNERS

		// Top left
		ctx.drawImage(cornerPic,
			this.corner_sprite.top_left.x,
			this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			0, 0,
			this.corner_sprite.width,
			this.corner_sprite.height
		);

		// Bottom left
		ctx.save();
		this.corner_sprite.rotate(ctx, new Point(0, canvas_H - this.corner_sprite.height), -90);
		ctx.drawImage(cornerPic,
			this.corner_sprite.top_left.x,
			this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			0, canvas_H - this.corner_sprite.height,
			this.corner_sprite.width,
			this.corner_sprite.height
		);
		ctx.restore();

		// Top right
		ctx.save();
		this.corner_sprite.rotate(ctx, new Point(canvas_W - this.corner_sprite.width, 0), 90);
		ctx.drawImage(cornerPic,
			this.corner_sprite.top_left.x,
			this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			canvas_W - this.corner_sprite.width, 0,
			this.corner_sprite.width,
			this.corner_sprite.height
		);
		ctx.restore();

		// Bottom right
		ctx.save();
		this.corner_sprite.rotate(ctx, new Point(canvas_W - this.corner_sprite.width, canvas_H - this.corner_sprite.height), 180);
		ctx.drawImage(cornerPic,
			this.corner_sprite.top_left.x,
			this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			canvas_W - this.corner_sprite.width, canvas_H - this.corner_sprite.height,
			this.corner_sprite.width,
			this.corner_sprite.height
		);
		ctx.restore();
	}
}