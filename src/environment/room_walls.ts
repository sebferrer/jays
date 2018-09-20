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

	// TODO: modéliser les portes dans une classe Door

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
			const dest_left_side = new Point(0, i * this.side_sprite.height);
			this.corner_sprite.rotate(ctx, dest_left_side, -90);
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				dest_left_side.x, dest_left_side.y,
				this.side_sprite.width, this.side_sprite.height
			);
			ctx.restore();
		}

		// BOTTOM
		for (let i = 1; i < 11; ++i) {
			ctx.save();
			const dest_bottom_side = new Point(i * this.side_sprite.width, canvas_H - this.side_sprite.height);
			this.corner_sprite.rotate(ctx, dest_bottom_side, -180);
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				dest_bottom_side.x, dest_bottom_side.y,
				this.side_sprite.width, this.side_sprite.height
			);
			ctx.restore();
		}

		// RIGHT
		for (let i = 1; i < 8; ++i) {
			ctx.save();
			const dest_right_side = new Point(canvas_W - this.side_sprite.width, i * this.side_sprite.height);
			this.corner_sprite.rotate(ctx, dest_right_side, 90);
			ctx.drawImage(side_pic,
				this.side_sprite.top_left.x, this.side_sprite.top_left.y,
				this.side_sprite.width, this.side_sprite.height,
				dest_right_side.x, dest_right_side.y,
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
		const dest_bottom_left_corner = new Point(0, canvas_H - this.corner_sprite.height);
		this.corner_sprite.rotate(ctx, dest_bottom_left_corner, -90);
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			dest_bottom_left_corner.x, dest_bottom_left_corner.y,
			this.corner_sprite.width, this.corner_sprite.height
		);
		ctx.restore();

		// Top right
		ctx.save();
		const dest_top_right_corner = new Point(canvas_W - this.corner_sprite.width, 0);
		this.corner_sprite.rotate(ctx, dest_top_right_corner, 90);
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			dest_top_right_corner.x, dest_top_right_corner.y,
			this.corner_sprite.width, this.corner_sprite.height
		);
		ctx.restore();

		// Bottom right
		ctx.save();
		const dest_bottom_right_corner = new Point(canvas_W - this.corner_sprite.width, canvas_H - this.corner_sprite.height);
		this.corner_sprite.rotate(ctx, dest_bottom_right_corner, 180);
		ctx.drawImage(corner_pic,
			this.corner_sprite.top_left.x, this.corner_sprite.top_left.y,
			this.corner_sprite.width, this.corner_sprite.height,
			dest_bottom_right_corner.x, dest_bottom_right_corner.y,
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

				case Direction.DOWN:
					ctx.save();
					const dest_down_door = new Point(canvas_W / 2 - this.door_sprite.width / 2, canvas_H - this.door_sprite.height);
					this.door_sprite.rotate(ctx, dest_down_door, 180);
					ctx.drawImage(door_pic,
						this.door_sprite.top_left.x, this.door_sprite.top_left.y,
						this.door_sprite.width, this.door_sprite.height,
						dest_down_door.x, dest_down_door.y,
						this.door_sprite.width, this.door_sprite.height
					);
					ctx.restore();
					break;

				case Direction.LEFT:
					ctx.save();
					const dest_left_door = new Point(0, canvas_H / 2 - this.door_sprite.height / 2);
					this.door_sprite.rotate(ctx, dest_left_door, -90);
					ctx.drawImage(door_pic,
						this.door_sprite.top_left.x, this.door_sprite.top_left.y,
						this.door_sprite.width, this.door_sprite.height,
						dest_left_door.x, dest_left_door.y,
						this.door_sprite.width, this.door_sprite.height
					);
					ctx.restore();
					break;

				case Direction.RIGHT:
					ctx.save();
					const dest_right_door = new Point(canvas_W - this.door_sprite.width, canvas_H / 2 - this.door_sprite.height / 2);
					this.door_sprite.rotate(ctx, dest_right_door, 90);
					ctx.drawImage(door_pic,
						this.door_sprite.top_left.x, this.door_sprite.top_left.y,
						this.door_sprite.width, this.door_sprite.height,
						dest_right_door.x, dest_right_door.y,
						this.door_sprite.width, this.door_sprite.height
					);
					ctx.restore();
					break;
			}
		});
	}

	/** Returns a dictionary which contain the top left position of each door, by direction */
	public getDoorPlacement(): { [key: string]: Point } {
		const result: { [key: string]: Point } = {};
		this.door_placement.forEach(direction => {
			switch (direction) {
				case Direction.UP:
					result[Direction.UP] = new Point(canvas_W / 2 - this.door_sprite.width / 2, 0);
					break;
				case Direction.DOWN:
					result[Direction.DOWN] = new Point(canvas_W / 2 - this.door_sprite.width / 2, canvas_H - this.door_sprite.height);
					break;
				case Direction.LEFT:
					result[Direction.LEFT] = new Point(0, canvas_H / 2 - this.door_sprite.height / 2);
					break;
				case Direction.RIGHT:
					result[Direction.RIGHT] = new Point(canvas_W - this.door_sprite.width, canvas_H / 2 - this.door_sprite.height / 2);
					break;
			}
		});
		return result;
	}

	// public getDoorPlacement(): { [key: string]: Point } {
	// 	const result: { [key: string]: Point } = {};
	// 	this.door_placement.forEach(direction => {
	// 		switch (direction) {
	// 			case Direction.UP:
	// 				result[Direction.UP] = new Point(canvas_W / 2, this.door_sprite.height);
	// 				break;
	// 			case Direction.DOWN:
	// 				result[Direction.DOWN] = new Point(canvas_W / 2, canvas_H - this.door_sprite.height);
	// 				break;
	// 			case Direction.LEFT:
	// 				result[Direction.LEFT] = new Point(this.door_sprite.width, canvas_H / 2);
	// 				break;
	// 			case Direction.RIGHT:
	// 				result[Direction.RIGHT] = new Point(canvas_W - this.door_sprite.width, canvas_H / 2);
	// 				break;
	// 		}
	// 	});
	// 	return result;
	// }
}