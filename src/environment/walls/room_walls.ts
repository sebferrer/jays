import { Rectangle } from "../../collision";
import { Direction } from "../../enum";
import { IUpdatableDrawable } from "../../idrawable";
import { PositionAccessor } from "../positions_accessor";
import { RoomCornerWall } from "./corner_wall";
import { Door } from "./door";
import { SideWall } from "./side_wall";
import { WallElement } from "./wall_element";

export class RoomWalls implements IUpdatableDrawable {

	protected _doors: Door[];
	public get doors(): Door[] { return this._doors; }

	protected _corner_walls: RoomCornerWall[];
	public get corner_walls(): RoomCornerWall[] { return this._corner_walls; }

	protected _side_walls: SideWall[];
	public get side_walls(): SideWall[] { return this._side_walls; }

	protected _misc_elements: WallElement[];
	public get misc_elements(): WallElement[] { return this._misc_elements; }

	public get wall_width(): number {
		return this.side_walls != null && this.side_walls.length > 0 ? this.side_walls[0].sprite.width : 0;
	}

	public get wall_height(): number {
		return this.side_walls != null && this.side_walls.length > 0 ? this.side_walls[0].sprite.height : 0;
	}

	public get requires_update(): boolean {
		return [...this.doors, ...this.corner_walls, ...this.side_walls, ...this._misc_elements].find(element => element.requires_update) != null;
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

	protected _walls_collisions_rectangle: Rectangle[];
	public get_walls_collisions_rectangles(): Rectangle[] {

		if (this._walls_collisions_rectangle != null) {
			return this._walls_collisions_rectangle;
		}

		this._walls_collisions_rectangle = new Array<Rectangle>();
		this.side_walls.map(wall => { return { wall, door: this.doors.find(door => door.direction === wall.direction) }; })
			.forEach(wd => {
				if (wd.door == null || !wd.door.is_open) {
					this._walls_collisions_rectangle.push(new Rectangle(PositionAccessor.top_left(wd.wall), PositionAccessor.bottom_right(wd.wall)));
				} else if (wd.door.direction === Direction.LEFT || wd.door.direction === Direction.RIGHT) {
					this._walls_collisions_rectangle.push(new Rectangle(PositionAccessor.top_left(wd.wall), PositionAccessor.top_right(wd.door)));
					this._walls_collisions_rectangle.push(new Rectangle(PositionAccessor.bottom_left(wd.door), PositionAccessor.bottom_right(wd.wall)));
				} else {
					this._walls_collisions_rectangle.push(new Rectangle(PositionAccessor.top_left(wd.wall), PositionAccessor.bottom_left(wd.door)));
					this._walls_collisions_rectangle.push(new Rectangle(PositionAccessor.top_right(wd.door), PositionAccessor.bottom_right(wd.wall)));
				}
			});

		return this._walls_collisions_rectangle;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		[
			...this.side_walls,
			...this.corner_walls,
			...this.misc_elements,
			...this.doors
		].forEach(element => element.draw(ctx));
		// this.draw_debug_rectangles(ctx, this.doors.map(d => d.get_exit_rectangle()));
		// this.draw_debug_rectangles(ctx, this.get_walls_collisions_rectangles());
	}

	private draw_debug_rectangles(ctx: CanvasRenderingContext2D, rectangles: Rectangle[]): void {
		rectangles.forEach(rectangle => {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;
			ctx.strokeRect(rectangle.top_left.x, rectangle.top_left.y, rectangle.width, rectangle.height);
		});
	}
}