import { Collision } from "./collision";
import { CollisionDelta } from "./collision_delta";
import { Direction } from "./enum";
import { IPositionable, PositionAccessor } from "./environment/positions_accessor";
import { gameState } from "./main";
import { Point } from "./point";
import { Sprite } from "./sprite";
import { SpriteHelper } from "./sprite_helper";

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

	constructor(id: string, current_sprite: Sprite, pos: Point, width: number, height: number) {
		this._id = id;
		this.current_sprite = current_sprite;
		this.position = new Point(pos.x, pos.y);
		this._width = width;
		this._height = height;
		this.sprite_collecs = SpriteHelper.get_collecs(this.id);
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
			this.position.x += collision_map.delta_x;
			this.position.y += collision_map.delta_y;
			this.on_collision_map();
		} else {
			this.position.x = next_position.x;
			this.position.y = next_position.y;
		}
	}

	public collision_map(direction: Direction, position: Point): CollisionDelta {

		// Collision with walls
		const collision_rectangle = gameState.current_room.room_walls
			.get_walls_collisions_rectangles()
			.find(rectangle => Collision.is_collision_rectangle(this, rectangle, position));
		if (collision_rectangle != null) {
			return this.get_collision_delta(direction, collision_rectangle);
		}

		// Collision with tiles
		for (let i = 0; i < gameState.current_room.height; i++) {
			for (let j = 0; j < gameState.current_room.width; j++) {
				const current_tile = gameState.current_room.tiles[i][j];
				if (!current_tile.has_collision || !Collision.is_collision_nextpos_entity_tile(position, this, current_tile)) {
					continue;
				}
				return this.get_collision_delta(direction, current_tile);
			}
		}

		return new CollisionDelta(false);
	}

	private get_collision_delta(direction: Direction, obstacle: IPositionable) {
		switch (direction) {
			case Direction.UP: return new CollisionDelta(true, 0, PositionAccessor.bottom_y(obstacle) - PositionAccessor.top_y(this));
			case Direction.DOWN: return new CollisionDelta(true, 0, PositionAccessor.top_y(obstacle) - PositionAccessor.bottom_y(this));
			case Direction.LEFT: return new CollisionDelta(true, PositionAccessor.right_x(obstacle) - PositionAccessor.left_x(this), 0);
			case Direction.RIGHT: return new CollisionDelta(true, PositionAccessor.left_x(obstacle) - PositionAccessor.right_x(this), 0);
			default:
				throw new Error(`Unexpected direction '${direction}'`);
		}
	}

	public on_collision_map(): void { }
}