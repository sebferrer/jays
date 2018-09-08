import { Point } from "../point";
import { WallSprite } from "./wall_sprite";
import { canvas_W, canvas_H, bank } from "../main";
import { IDrawable } from "../idrawable";
import { Direction } from "../enum";

export abstract class RoomWalls implements IDrawable {
	protected _corner_sprite: WallSprite;
	public get corner_sprite(): WallSprite { return this._corner_sprite; }

	protected _side_sprite: WallSprite;
	public get side_sprite(): WallSprite { return this._side_sprite; }

	protected _door_sprite: WallSprite;
	public get door_sprite(): WallSprite { return this._door_sprite; }

	protected _door_placement: Direction[];
	public get door_placement(): Direction[] { return this._door_placement; }

	constructor(
		corner_sprite: WallSprite,
		side_sprite: WallSprite,
		door_sprite: WallSprite,
		door_placement: Direction[]
	) {
		if (corner_sprite == null) {
			throw new Error("Parameter 'corner_sprite' cannot be null");
		}
		if (side_sprite == null) {
			throw new Error("Parameter 'side_sprite' cannot be null");
		}
		if (door_sprite == null) {
			throw new Error("Parameter 'door_sprite' cannot be null");
		}
		if (door_placement == null || door_placement.length === 0) {
			throw new Error("Parameter 'door_placement' cannot be null nor empty");
		}

		this._corner_sprite = corner_sprite;
		this._side_sprite = side_sprite;
		this._door_sprite = door_sprite;
		this._door_placement = door_placement;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		const side_pic = bank.pic[this.side_sprite.sprite_sheet_path];
		const corner_pic = bank.pic[this.corner_sprite.sprite_sheet_path];
		const door_pic = bank.pic[this.door_sprite.sprite_sheet_path];

		// SIDES

		// TOP
		for (let i = 1; i < 11; ++i) {
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				i * this.side_sprite.width, 0,
				this.side_sprite.width, this.side_sprite.height
			);
		}

		// LEFT
		for (let i = 1; i < 8; ++i) {
			ctx.save();
			this.corner_sprite.rotate(ctx, new Point(0, i * this.side_sprite.height), -90);
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				0, i * this.side_sprite.height,
				this.side_sprite.width, this.side_sprite.height
			);
			ctx.restore();
		}

		// BOTTOM
		for (let i = 1; i < 11; ++i) {
			ctx.save();
			this.corner_sprite.rotate(ctx, new Point(i * this.side_sprite.width, canvas_H - this.side_sprite.height), -180);
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				i * this.side_sprite.width, canvas_H - this.side_sprite.height,
				this.side_sprite.width, this.side_sprite.height
			);
			ctx.restore();
		}

		// RIGHT
		for (let i = 1; i < 8; ++i) {
			ctx.save();
			this.corner_sprite.rotate(ctx, new Point(canvas_W - this.side_sprite.width, i * this.side_sprite.height), 90);
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				canvas_W - this.side_sprite.width, i * this.side_sprite.height,
				this.side_sprite.width, this.side_sprite.height
			);
			ctx.restore();
		}

		// CORNERS

		// Top left
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			0, 0,
			this.corner_sprite.width, this.corner_sprite.height
		);

		// Bottom left
		ctx.save();
		this.corner_sprite.rotate(ctx, new Point(0, canvas_H - this.corner_sprite.height), -90);
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			0, canvas_H - this.corner_sprite.height,
			this.corner_sprite.width, this.corner_sprite.height
		);
		ctx.restore();

		// Top right
		ctx.save();
		this.corner_sprite.rotate(ctx, new Point(canvas_W - this.corner_sprite.width, 0), 90);
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			canvas_W - this.corner_sprite.width, 0,
			this.corner_sprite.width, this.corner_sprite.height
		);
		ctx.restore();

		// Bottom right
		ctx.save();
		this.corner_sprite.rotate(ctx, new Point(canvas_W - this.corner_sprite.width, canvas_H - this.corner_sprite.height), 180);
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			canvas_W - this.corner_sprite.width, canvas_H - this.corner_sprite.height,
			this.corner_sprite.width, this.corner_sprite.height
		);
		ctx.restore();

		// DOORS
		this.door_placement.forEach(placement => {

			switch (placement) {
				case Direction.UP:
					ctx.drawImage(door_pic,
						this.door_sprite.top_left.x, this.door_sprite.top_left.y,
						this.door_sprite.width, this.door_sprite.height,
						canvas_W / 2 - this.door_sprite.width / 2, 0,
						this.door_sprite.width, this.door_sprite.height
					);
					break;
			}

		});
	}
}