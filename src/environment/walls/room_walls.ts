import { IDrawable } from "../../idrawable";
import { RoomCornerWall } from "./corner_wall";
import { SideWall } from "./side_wall";
import { Door } from "./door";
import { WallElement } from "./wall_element";
import { Rectangle } from "../../collision";
import { Point } from "../../point";
import { Direction } from "../../enum";

export class RoomWalls implements IDrawable {
	protected _corner_walls: RoomCornerWall[];
	public get corner_walls(): RoomCornerWall[] { return this._corner_walls; }

	protected _side_walls: SideWall[];
	public get side_walls(): SideWall[] { return this._side_walls; }

	protected _doors: Door[];
	public get doors(): Door[] { return this._doors; }

	protected _misc_elements: WallElement[];
	public get misc_elements(): WallElement[] { return this._misc_elements; }

	public get wall_width(): number {
		return this.side_walls != null && this.side_walls.length > 0 ? this.side_walls[0].sprite.width : 0;
	}

	public get wall_height(): number {
		return this.side_walls != null && this.side_walls.length > 0 ? this.side_walls[0].sprite.height : 0;
	}

	constructor(
		side_walls: SideWall[],
		corner_walls: RoomCornerWall[],
		doors: Door[],
		misc_elements: WallElement[] = null
	) {
		if (corner_walls == null) {
			throw new Error("Parameter 'corner_sprite' cannot be null");
		}
		if (side_walls == null) {
			throw new Error("Parameter '_side_walls' cannot be null");
		}
		if (doors == null) {
			throw new Error("Parameter 'door_sprite' cannot be null");
		}

		this._corner_walls = corner_walls;
		this._side_walls = side_walls;
		this._doors = doors;
		this._misc_elements = misc_elements != null ? misc_elements : [];
	}

	public get_walls_collisions_rectangle(): Rectangle[] {
		//TODO: store this to avoid computing it each time
		//the only change which could happen is a door opening, just re-compute
		// the Rectangle array when this happens
		const result = new Array<Rectangle>();
		this.side_walls.map(wall => {
			return { wall, door: this.doors.find(door => door.direction === wall.direction) };
		})
			.forEach(wd => {
				if (wd.door == null || !wd.door.is_open) {
					result.push(new Rectangle(wd.wall.positions_accessor.top_left, wd.wall.positions_accessor.bottom_right));
				} else if (wd.door.direction === Direction.LEFT || wd.door.direction === Direction.RIGHT) {
					result.push(new Rectangle(wd.wall.positions_accessor.top_left, wd.door.positions_accessor.top_right));
					result.push(new Rectangle(wd.door.positions_accessor.bottom_left, wd.wall.positions_accessor.bottom_right));
				} else {
					result.push(new Rectangle(wd.wall.positions_accessor.top_left, wd.door.positions_accessor.bottom_left));
					result.push(new Rectangle(wd.door.positions_accessor.top_right, wd.wall.positions_accessor.bottom_right));
				}
			});
		return result;
	}

	public get_doors_collisions_rectangle(): Rectangle[] {
		return this.doors
			.filter(door => door != null && door.is_open)
			.map(door => door.get_exit_rectangle());
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		[
			...this.side_walls,
			...this._corner_walls,
			...this.doors,
			...this.misc_elements
		].forEach(element => element.draw(ctx));
		this.draw_collision_rectangle(ctx);
	}

	private draw_collision_rectangle(ctx: CanvasRenderingContext2D): void {
		this.get_walls_collisions_rectangle().forEach(rectangle => {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;
			ctx.strokeRect(rectangle.top_left.x, rectangle.top_left.y, rectangle.width, rectangle.height);
		});
	}
}