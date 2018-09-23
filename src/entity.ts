import { Collision } from "./collision";
import { gameState } from "./main";
import { Direction } from "./enum";
import { Point } from "./point";
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
	public pos: Point;

	constructor(id: string, current_sprite: Sprite, pos: Point, width: number, height: number) {
		this.id = id;
		this.current_sprite = current_sprite;
		this.pos = new Point(pos.x, pos.y);
		this.width = width;
		this.height = height;
		this.sprite_collecs = SpriteHelper.getCollecs(this.id);
	}

	public next_position(direction: Direction): Point {
		const pos = new Point(this.pos.x, this.pos.y);
		switch (direction) {
			case Direction.UP: pos.y = this.pos.y - this.speed; break;
			case Direction.DOWN: pos.y = this.pos.y + this.speed; break;
			case Direction.LEFT: pos.x = this.pos.x - this.speed; break;
			case Direction.RIGHT: pos.x = this.pos.x + this.speed; break;
		}
		return new Point(pos.x, pos.y);
	}

	public move_direction(direction: Direction): void {
		const next_position = this.next_position(direction);
		const collision_map = this.collision_map(direction, next_position);
		if (collision_map.is_collision) {
			if (collision_map.delta_x !== 0) { this.pos.x += collision_map.delta_x; }
			if (collision_map.delta_y !== 0) { this.pos.y += collision_map.delta_y; }
			this.on_collision_map();
		} else {
			this.pos.x = next_position.x;
			this.pos.y = next_position.y;
		}
		this.get_collision_warp();
		// if (collision_warp != null) {
		// 	this.on_collision_warp(collision_warp);
		// }
	}

	public collision_map(direction: Direction, position: Point): CollisionDelta {

		// Collision with walls
		const collision_rectangle = gameState.current_map.room_walls
			.get_walls_collisions_rectangles()
			.find(rectangle => Collision.is_collision_rectangle(this, rectangle, position));
		if (collision_rectangle != null) {
			return this.get_collision_delta(direction, position);
		}

		// Collision with tiles
		for (let i = 0; i < gameState.current_map.height; i++) {
			for (let j = 0; j < gameState.current_map.width; j++) {
				const current_tile = gameState.current_map.tiles[i][j];
				if (!current_tile.has_collision || !Collision.is_collision_nextpos_entity_tile(position, this, current_tile)) {
					continue;
				}
				return this.get_collision_delta(direction, position);
			}
		}

		return new CollisionDelta(false);
	}

	private get_collision_delta(direction: Direction, position: Point) {
		switch (direction) {
			case Direction.UP: return new CollisionDelta(true, 0, this.pos.y - position.y);
			case Direction.DOWN: return new CollisionDelta(true, 0, -(position.y - this.pos.y));
			case Direction.LEFT: return new CollisionDelta(true, this.pos.x - position.x, 0);
			case Direction.RIGHT: return new CollisionDelta(true, -(position.x - this.pos.x), 0);
		}
	}

	public get_collision_warp(): void {

		// Doors
		const collided_door = gameState.current_map.room_walls.doors
			.find(door => Collision.is_collision_rectangle(this, door.get_exit_rectangle()));
		if (collided_door != null) {
			gameState.current_floor.on_collision_warp(collided_door);
			return;
		}

		// for (let i = 0; i < gameState.current_map.height; i++) {
		// 	for (let j = 0; j < gameState.current_map.width; j++) {
		// 		const tile = gameState.current_map.tiles[i][j];
		// 		const warp_info = tile.get_warp_info();
		// 		if (warp_info != null && Collision.is_collision_entity_tile(this, tile)) {
		// 			return new CollisionWarp(warp_info, tile);
		// 		}
		// 	}
		// }
	}

	public abstract on_collision_map(): void;

	public abstract on_collision_warp(collision_warp: CollisionWarp): void;
}