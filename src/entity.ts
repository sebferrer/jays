import { Collision } from "./collision";
import { gameState } from "./main";
import { Direction } from "./enum";
import { Position } from "./position";
import { CollisionDelta } from "./collision_delta";
import { CollisionWarp } from "./collision_warp";
import { Sprite } from "./sprite";
import { SpriteHelper } from "./sprite_helper";

export abstract class Entity { // Abstract, will never be instancied
	public id: string;
	public facing_direction: Direction;
	public sprite_filename: string;
	public current_sprite: Sprite;
	public sprite_collecs: Map<string, Sprite[]>;
	public speed: number;
	public width: number;
	public height: number;
	public pos_x: number;
	public pos_y: number;

	constructor(id: string, current_sprite: Sprite, pos_x: number, pos_y: number, width: number, height: number) {
		this.id = id;
		this.current_sprite = current_sprite;
		this.pos_x = pos_x;
		this.pos_y = pos_y;
		this.width = width;
		this.height = height;
		this.sprite_collecs = SpriteHelper.getCollecs(this.id);
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
		if (collision_map.is_collision) {
			if (collision_map.delta_x !== 0) { this.pos_x += collision_map.delta_x; }
			if (collision_map.delta_y !== 0) { this.pos_y += collision_map.delta_y; }
			this.on_collision_map();
		} else {
			this.pos_x = next_position.pos_x;
			this.pos_y = next_position.pos_y;
		}
		const collision_warp = this.get_collision_warp();
		if (collision_warp != null) {
			this.on_collision_warp(collision_warp);
		}
	}

	public collision_map(direction: Direction, position: Position): CollisionDelta {
		for (let i = 0; i < gameState.current_map.height; i++) {
			for (let j = 0; j < gameState.current_map.width; j++) {
				const current_tile = gameState.current_map.tiles[i][j];
				if (!current_tile.has_collision || !Collision.is_collision_nextpos_entity_tile(position, this, current_tile)) {
					continue;
				}
				switch (direction) {
					case Direction.UP: return new CollisionDelta(true, 0, (current_tile.pos_y + current_tile.height - this.pos_y)); break;
					case Direction.DOWN: return new CollisionDelta(true, 0, (this.pos_y + this.height - current_tile.pos_y) * -1); break;
					case Direction.LEFT: return new CollisionDelta(true, (current_tile.pos_x + current_tile.width - this.pos_x), 0); break;
					case Direction.RIGHT: return new CollisionDelta(true, (this.pos_x + this.width - current_tile.pos_x) * -1, 0); break;
				}
			}
		}
		return new CollisionDelta(false);
	}

	public get_collision_warp(): CollisionWarp | null {
		for (let i = 0; i < gameState.current_map.height; i++) {
			for (let j = 0; j < gameState.current_map.width; j++) {
				const tile = gameState.current_map.tiles[i][j];
				const warp_info = tile.get_warp_info();
				if (warp_info != null && Collision.is_collision_entity_tile(this, tile)) {
					return new CollisionWarp(warp_info, tile);
				}
			}
		}
		return null;
	}

	public abstract on_collision_map(): void;

	public abstract on_collision_warp(collision_warp: CollisionWarp): void;
}