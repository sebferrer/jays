import { Tile } from "./environment/tile";
import { Entity } from "./entity";
import { Point } from "./point";
import { IPositionable, PositionAccessor } from "./environment/positions_accessor";


export class Rectangle implements IPositionable {

	public get width(): number { return this.bottom_right.x - this.top_left.x; }
	public get height(): number { return this.bottom_right.y - this.top_left.y; }
	public get position(): Point { return this.top_left;}

	public top_left: Point;
	public bottom_right: Point;

	private _positions_accessor: PositionAccessor;
	public get positions_accessor(): PositionAccessor { return this._positions_accessor; }

	constructor(top_left: Point, bottom_right: Point) {
		this.top_left = Point.copy(top_left);
		this.bottom_right = Point.copy(bottom_right);
		this._positions_accessor = new PositionAccessor(this); 
	}
}

export class Collision {
	private constructor() { }

	public static is_collision_rectangle(entity: Entity, object: Rectangle, next_position: Point = null): boolean {
		if (object == null) {
			return false;
		}
		if (next_position == null) {
			next_position = entity.position;
		}

		return Collision.is_collision(
			next_position.x, next_position.y, next_position.x + entity.width, next_position.y + entity.height,
			object.top_left.x, object.top_left.y, object.bottom_right.x, object.bottom_right.y
		);
	}

	public static is_collision(collisioner_x1: number, collisioner_y1: number, collisioner_x2: number, collisioner_y2: number,
		collisionee_x1: number, collisionee_y1: number, collisionee_x2: number, collisionee_y2: number): boolean {
		return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
			collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1;
	}

	public static is_collision_entity_tile(entity: Entity, tile: Tile): boolean {
		return Collision.is_collision(entity.position.x, entity.position.y, entity.position.x + entity.width, entity.position.y + entity.height,
			tile.position.x, tile.position.y, tile.position.x + tile.width, tile.position.y + tile.height);
	}

	public static is_collision_nextpos_entity_tile(next_position: Point, entity: Entity, tile: Tile): boolean {
		return Collision.is_collision(next_position.x, next_position.y, next_position.x + entity.width, next_position.y + entity.height,
			tile.position.x, tile.position.y, tile.position.x + tile.width, tile.position.y + tile.height);
	}

	/**
	 * TODO: I'd like to make Jays able to cross most of the warp before changing map without writing ugly code...
	 */
}