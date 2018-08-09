import { Collision } from "./collision";
import { gameState } from "./main";
import { Direction } from "./enum";
import { Position } from "./position";
import { CollisionDelta } from "./collision_delta";
import { CollisionWarp } from "./collision_warp";
import { Sprite } from "./sprite";

export class Entity { // Abstract, will never be instancied
	public facing_direction: Direction;
	public sprite_filename: string;
	public current_sprite: Sprite;
	public sprite_collecs: Map<string, Sprite[]>;
	public speed: number;
	public width: number;
	public height: number;
	public pos_x: number;
	public pos_y: number;

	constructor(current_sprite: Sprite, width: number, height: number, pos_x: number, pos_y: number) {
		this.current_sprite = current_sprite;
		this.width = width;
		this.height = height;
		this.pos_x = pos_x;
		this.pos_y = pos_y;
		this.sprite_collecs = new Map<string, Sprite[]>();
	}

	public next_position(direction: Direction): Position {
		let pos_x = this.pos_x;
		let pos_y = this.pos_y;
		switch (direction) {
			case Direction.UP: pos_y = this.pos_y - this.speed; break;
			case Direction.DOWN: pos_y = this.pos_y + this.speed; break;
			case Direction.LEFT: pos_x = this.pos_x - this.speed; break;
			case Direction.RIGHT: pos_x = this.pos_x + this.speed; break;
		}
		return new Position(pos_x, pos_y);
	}

	public move_direction(direction: Direction): void {
		const next_position = this.next_position(direction);
		const collision_map = this.collision_map(direction, next_position);
		if (!collision_map.is_collision) {
			this.pos_x = next_position.pos_x;
			this.pos_y = next_position.pos_y;
		} else {
			if (collision_map.delta_x !== 0) { this.pos_x += collision_map.delta_x; }
			if (collision_map.delta_y !== 0) { this.pos_y += collision_map.delta_y; }
			this.has_collision_map();
		}
		const collision_warp = this.collision_warp();
		if (collision_warp.is_collision) {
			this.has_collision_warp();
		}
	}

	public collision_map(direction: Direction, position: Position): CollisionDelta {
		for (let i = 0; i < gameState.current_map.height; i++) {
			for (let j = 0; j < gameState.current_map.width; j++) {
				const tile = gameState.current_map.tiles[i][j];
				if (!tile.has_collision || !Collision.is_collision_nextpos_entity_tile(position, this, tile)) {
					continue;
				}
				switch (direction) {
					case Direction.UP: return new CollisionDelta(true, 0, (tile.pos_y + tile.height - this.pos_y)); break;
					case Direction.DOWN: return new CollisionDelta(true, 0, (this.pos_y + this.height - tile.pos_y) * -1); break;
					case Direction.LEFT: return new CollisionDelta(true, (tile.pos_x + tile.width - this.pos_x), 0); break;
					case Direction.RIGHT: return new CollisionDelta(true, (this.pos_x + this.width - tile.pos_x) * -1, 0); break;
				}
			}
		}
		return new CollisionDelta(false, 0, 0);
	}

	public collision_warp(): CollisionWarp {
		for (let i = 0; i < gameState.current_map.height; i++) {
			for (let j = 0; j < gameState.current_map.width; j++) {
				const tile = gameState.current_map.tiles[i][j];
				const warp_destination = tile.warp_destination();
				if (warp_destination.is_warp) {
					const is_collision = Collision.is_collision_entity_tile(this, tile);
					if (is_collision) {
						return new CollisionWarp(true, warp_destination.is_warp, warp_destination.destination);
					}
				}
			}
		}
		return new CollisionWarp(false, false, -1);
	}

	public has_collision_map() { }

	public has_collision_warp() { }
}