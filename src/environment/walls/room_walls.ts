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

	public get_collisions_rectangle() {
		const result = new Array<Rectangle>();
		this.side_walls.map(wall => {
			return { wall, door: this.doors.find(door => door.direction === wall.direction) };
		})
			.forEach(wall_and_door => {

				if (wall_and_door.door == null || !wall_and_door.door.is_open) {
					result.push(new Rectangle(
						wall_and_door.wall.position,
						new Point(
							wall_and_door.wall.position.x + wall_and_door.wall.width,
							wall_and_door.wall.position.y + wall_and_door.wall.height
						)
					));
				} else if (wall_and_door.door.direction === Direction.LEFT || wall_and_door.door.direction === Direction.RIGHT) {
					result.push(
						new Rectangle(
							wall_and_door.wall.position,
							new Point(
								wall_and_door.door.position.x + wall_and_door.door.width,
								wall_and_door.door.position.y
							)
						)
					);
					result.push(
						new Rectangle(
							new Point(
								wall_and_door.door.position.x,
								wall_and_door.door.position.y + wall_and_door.door.height),
							new Point(
								wall_and_door.door.position.x + wall_and_door.door.width,
								wall_and_door.wall.position.y + wall_and_door.wall.height
							)
						)
					);
				} else {
					result.push(
						new Rectangle(
							wall_and_door.wall.position,
							new Point(
								wall_and_door.door.position.x,
								wall_and_door.door.position.y + wall_and_door.door.height
							)
						)
					);
					result.push(
						new Rectangle(
							new Point(
								wall_and_door.door.position.x + wall_and_door.door.width,
								wall_and_door.door.position.y
							),
							new Point(
								wall_and_door.wall.position.x + wall_and_door.wall.width,
								wall_and_door.wall.position.y + wall_and_door.wall.height
							)
						)
					);
				}
			});
		return result;
	}


	public draw(ctx: CanvasRenderingContext2D): void {
		[
			...this.side_walls,
			...this._corner_walls,
			...this.doors,
			...this.misc_elements
		].forEach(element => element.draw(ctx));
	}

	private draw_collision_rectangle(ctx: CanvasRenderingContext2D): void {
		this.get_collisions_rectangle().forEach(rectangle => {
			ctx.strokeStyle = "red";
			ctx.lineWidth = 5;
			ctx.strokeRect(rectangle.top_left.x, rectangle.top_left.y, rectangle.width, rectangle.height);
		});
	}
}