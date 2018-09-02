import { Tile } from "./tile";
import { Entity } from "./entity";
import { Point } from "./point";

export class Collision {
	private constructor() { }

	public static is_collision(collisioner_x1: number, collisioner_y1: number, collisioner_x2: number, collisioner_y2: number,
		collisionee_x1: number, collisionee_y1: number, collisionee_x2: number, collisionee_y2: number): boolean {
		return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
			collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1;
	}

	public static is_collision_entity_tile(entity: Entity, tile: Tile): boolean {
		return Collision.is_collision(entity.pos.x, entity.pos.y, entity.pos.x + entity.width, entity.pos.y + entity.height,
			tile.pos.x, tile.pos.y, tile.pos.x + tile.width, tile.pos.y + tile.height);
	}

	public static is_collision_nextpos_entity_tile(next_position: Point, entity: Entity, tile: Tile): boolean {
		return Collision.is_collision(next_position.x, next_position.y, next_position.x + entity.width, next_position.y + entity.height,
			tile.pos.x, tile.pos.y, tile.pos.x + tile.width, tile.pos.y + tile.height);
	}

	/**
	 * TODO: I'd like to make Jays able to crossing most of the warp before changing map without writing ugly code...
	 */
}