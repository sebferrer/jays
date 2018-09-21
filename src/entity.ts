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
		const collision_warp = this.get_collision_warp();
		if (collision_warp != null) {
			this.on_collision_warp(collision_warp);
		}
	}

	public collision_map(direction: Direction, position: Point): CollisionDelta {

		// const wall_sprite = gameState.current_map.room_walls.side_sprite;

		// // Wall
		// if (position.x < wall_sprite.width) {
		// 	// LEFT
		// 	return new CollisionDelta(true, this.pos.x - position.x, 0);
		// } else if (position.y < wall_sprite.height) {
		// 	// UP
		// 	return new CollisionDelta(true, 0, this.pos.y - position.y);
		// }
		// else if (position.y > (((gameState.current_map.height) * gameState.current_map.tile_height) + wall_sprite.height - this.height)) {
		// 	// DOWN
		// 	return new CollisionDelta(true, 0, -(position.y - this.pos.y));
		// } else if (position.x > (((gameState.current_map.width) * gameState.current_map.tile_width) + wall_sprite.width - this.width)) {
		// 	// RIGHT
		// 	return new CollisionDelta(true, -(position.x - this.pos.x));
		// }

		const wall_rectangles = gameState.current_map.room_walls.get_collisions_rectangle();
		for (let i = 0; i < wall_rectangles.length; ++i) {
			if (!Collision.is_collision_rectangle(this, position, wall_rectangles[i])) {
				continue;
			}
			return this.get_collision_delta(direction, position);
		}

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

	public get_collision_warp(): CollisionWarp | null {

		// // Doors
		// const entity_center = new Point(this.pos.x + this.width / 2, this.pos.y - this.height / 2);
		// const doors = gameState.current_map.room_walls.get_door_placement();

		// for (const direction in doors) {
		// 	const door_placement = doors[direction];

		// 	if (entity_center.distanceBetween(door_placement) <= 60) {
		// 		console.log("player: (" + this.pos.x + ", " + this.pos.y + ")");
		// 		console.log("door:" + direction + " (" + door_placement.x + ", " + door_placement.y + ")");
		// 		console.log(entity_center.distanceBetween(door_placement));
		// 	}
		// }

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