import { Collision } from "./collision";
import { gameState } from "./main";
import { Direction } from "./enum";
import { Point } from "./point";
import { CollisionDelta } from "./collision_delta";
import { Sprite } from "./sprite";
import { SpriteHelper } from "./sprite_helper";
import { PositionAccessor, IPositionable } from "./environment/positions_accessor";

export abstract class Entity implements IPositionable {

	protected _id: string;
	public get id(): string { return this._id; }

	public sprite_filename: string;
	public current_sprite: Sprite;
	public sprite_collecs: Map<string, Sprite[]>;
	public speed: number;

	protected _width: number;
	public get width(): number { return this._width; }

	protected _height: number;
	public get height(): number { return this._height; }

	public position: Point;

	protected _positions_accessor: PositionAccessor;
	public get positions_accessor(): PositionAccessor { return this._positions_accessor; }

	constructor(id: string, current_sprite: Sprite, pos: Point, width: number, height: number) {
		this._id = id;
		this.current_sprite = current_sprite;
		this.position = new Point(pos.x, pos.y);
		this._width = width;
		this._height = height;
		this.sprite_collecs = SpriteHelper.getCollecs(this.id);
		this._positions_accessor = new PositionAccessor(this);
	}

	public next_position(direction: Direction): Point {
		const pos = new Point(this.position.x, this.position.y);
		switch (direction) {
			case Direction.UP: pos.y = this.position.y - this.speed; break;
			case Direction.DOWN: pos.y = this.position.y + this.speed; break;
			case Direction.LEFT: pos.x = this.position.x - this.speed; break;
			case Direction.RIGHT: pos.x = this.position.x + this.speed; break;
		}
		return new Point(pos.x, pos.y);
	}

	public move_direction(direction: Direction): void {
		const next_position = this.next_position(direction);
		const collision_map = this.collision_map(direction, next_position);
		if (collision_map.is_collision) {
			if (collision_map.delta_x !== 0) { this.position.x += collision_map.delta_x; }
			if (collision_map.delta_y !== 0) { this.position.y += collision_map.delta_y; }
			this.on_collision_map();
		} else {
			this.position.x = next_position.x;
			this.position.y = next_position.y;
		}
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
			case Direction.UP: return new CollisionDelta(true, 0, this.position.y - position.y);
			case Direction.DOWN: return new CollisionDelta(true, 0, -(position.y - this.position.y));
			case Direction.LEFT: return new CollisionDelta(true, this.position.x - position.x, 0);
			case Direction.RIGHT: return new CollisionDelta(true, -(position.x - this.position.x), 0);
		}
	}

	public on_collision_map(): void { }
}