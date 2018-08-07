import { Tile } from "./tile";
import { Entity } from "./entity";
import { Position } from "./position";

export class Collision {
	private constructor() { }

	public static is_collision(collisioner_x1: number, collisioner_y1: number, collisioner_x2: number, collisioner_y2: number,
		collisionee_x1: number, collisionee_y1: number, collisionee_x2: number, collisionee_y2: number): boolean {
		return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
			collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1;
	}

	public static is_collision_entity_tile(entity: Entity, tile: Tile): boolean {
		return Collision.is_collision(entity.pos_x, entity.pos_y, entity.pos_x + entity.width, entity.pos_y + entity.height,
			tile.pos_x, tile.pos_y, tile.pos_x + tile.width, tile.pos_y + tile.height);
	}

	public static is_collision_nextpos_entity_tile(next_position: Position, entity: Entity, tile: Tile): boolean {
		return Collision.is_collision(next_position.pos_x, next_position.pos_y, next_position.pos_x + entity.width, next_position.pos_y + entity.height,
			tile.pos_x, tile.pos_y, tile.pos_x + tile.width, tile.pos_y + tile.height);
	}

    /**
     * TODO: I'd like to make Jays able to crossing most of the warp before changing map without writing ugly code...
     */
}