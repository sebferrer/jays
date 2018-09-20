import { Point } from "../point";
import { WallSprite } from "./wall_sprite";
import { canvas_W, canvas_H, bank } from "../main";
import { IDrawable } from "../idrawable";
import { RoomSideWall } from "./room_side_wall";
import { RoomDoor } from "./room_door";

export abstract class RoomWalls implements IDrawable {
	protected _corner_sprite: WallSprite;
	public get corner_sprite(): WallSprite { return this._corner_sprite; }

	protected _side_walls: RoomSideWall[];
	public get side_walls(): RoomSideWall[] { return this._side_walls; }

	protected _doors: RoomDoor[];
	public get doors(): RoomDoor[] { return this._doors; }

	public get wall_width(): number {
		return this.side_walls != null && this.side_walls.length > 0 ? this.side_walls[0].sprite.width : 0;
	}

	public get wall_height(): number {
		return this.side_walls != null && this.side_walls.length > 0 ? this.side_walls[0].sprite.height : 0;
	}

	constructor(
		corner_sprite: WallSprite,
		side_walls: RoomSideWall[],
		doors: RoomDoor[]
	) {
		if (corner_sprite == null) {
			throw new Error("Parameter 'corner_sprite' cannot be null");
		}
		if (side_walls == null) {
			throw new Error("Parameter '_side_walls' cannot be null");
		}
		if (doors == null) {
			throw new Error("Parameter 'door_sprite' cannot be null");
		}

		this._corner_sprite = corner_sprite;
		this._side_walls = side_walls;
		this._doors = doors;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		this.side_walls.forEach(side_wall => side_wall.draw(ctx));
		this.doors.forEach(door => door.draw(ctx));

		// CORNERS
		const corner_pic = bank.pic[this.corner_sprite.sprite_sheet_path];

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
		this.doors.forEach(door => door.draw);
	}
}