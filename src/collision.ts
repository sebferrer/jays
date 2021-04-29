import { Entity } from "./entity";
import { IPositionable } from "./environment/positions_accessor";
import { Tile } from "./environment/tile";
import { Point } from "./point";
import { Rect } from "./rect";

export class Rectangle implements IPositionable {

	public get width(): number { return this.bottom_right.x - this.top_left.x; }
	public get height(): number { return this.bottom_right.y - this.top_left.y; }
	public get position(): Point { return this.top_left; }

	public top_left: Point;
	public bottom_right: Point;

	constructor(top_left: Point, bottom_right: Point) {
		this.top_left = Point.copy(top_left);
		this.bottom_right = Point.copy(bottom_right);
	}
}

export class Collision {
	private constructor() { }

	public static is_collision_rectangle(entity: Entity, object: Rectangle, next_position: Point = null, height_perspective?: number): boolean {
		height_perspective = height_perspective == null ? 0 : height_perspective;
		if (object == null) {
			return false;
		}
		if (next_position == null) {
			next_position = entity.position;
		}

		return this.is_collision(
			next_position.x, next_position.y, next_position.x + entity.width, next_position.y + entity.height,
			object.top_left.x, object.top_left.y, object.bottom_right.x, object.bottom_right.y - height_perspective
		);
	}

	public static is_collision(collisioner_x1: number, collisioner_y1: number, collisioner_x2: number, collisioner_y2: number,
		collisionee_x1: number, collisionee_y1: number, collisionee_x2: number, collisionee_y2: number): boolean {
		return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
			collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1;
	}

	public static is_collision_rect(rect1: Rect, rect2: Rect): boolean {
		return this.is_collision(rect1.x, rect1.y, rect1.x + rect1.width, rect1.y + rect1.height,
			rect2.x, rect2.y, rect2.x + rect2.width, rect2.y + rect2.height);
	}

	public static is_collision_rects(rect1: Rect, rects: Rect[]): boolean {
		for (let i = 0; i < rects.length; i++) {
			if (this.is_collision(rect1.x, rect1.y, rect1.x + rect1.width, rect1.y + rect1.height,
				rects[i].x, rects[i].y, rects[i].x + rects[i].width, rects[i].y + rects[i].height)) {
					return true;
			}
		}
		return false;
	}

	public static is_collision_entity_tile(entity: Entity, tile: Tile): boolean {
		return this.is_collision(entity.position.x, entity.position.y, entity.position.x + entity.width, entity.position.y + entity.height,
			tile.position.x, tile.position.y, tile.position.x + tile.width, tile.position.y + tile.height);
	}

	public static is_collision_nextpos_entity_tile(next_position: Point, entity: Entity, tile: Tile, height_perspective?: number): boolean {
		height_perspective = height_perspective == null ? 0 : height_perspective;
		return this.is_collision(next_position.x, next_position.y, next_position.x + entity.width, next_position.y + entity.height,
			tile.position.x, tile.position.y, tile.position.x + tile.width, tile.position.y + tile.height - height_perspective);
	}

	public static is_collision_nextpos_entity(next_position: Point, entity1: Entity, entity2: Entity, height_perspective?: number): boolean {
		height_perspective = height_perspective == null ? 0 : height_perspective;
		return this.is_collision(next_position.x, next_position.y, next_position.x + entity1.width, next_position.y + entity1.height,
			entity2.position.x, entity2.position.y, entity2.position.x + entity2.width, entity2.position.y + entity2.height - height_perspective);
	}
}