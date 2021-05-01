import { IUpdatableDrawable } from "../../idrawable";
import { IRawMap } from "../irawmap";
import { Tile, TILE_REF, TILE_TYPES } from "../tile";
import { RoomWalls } from "../walls/room_walls";
import { DrawableEntity } from "../../drawable_entity";
import { Rect } from "../../rect";
import { MathUtil } from "../../util";
import { Rock, ROCK_2 } from "../entities/rock";
import { Point } from "../../point";
import { canvas_W, canvas_H } from "../../main";
import { Collision } from "../../collision";
import { ActionableEntity } from "../../actionable_entity";

export abstract class RoomMap implements IUpdatableDrawable {
	protected _id: number;
	public get id(): number { return this._id; }
	public set id(id: number) {
		if (this._id != null) {
			throw new Error("Cannot set a room id twice");
		}
		this._id = id;
	}

	protected _raw_map: IRawMap;
	public get raw_map(): IRawMap { return this._raw_map; }

	protected _room_walls: RoomWalls;
	public get room_walls(): RoomWalls { return this._room_walls; }

	public get height(): number { return this._raw_map.height; }
	public get width(): number { return this._raw_map.width; }

	protected _tiles: Tile[][];
	public get tiles() { return this._tiles; }

	public get tile_height(): number { return this._tiles[0][0].height; }
	public get tile_width(): number { return this._tiles[0][0].width; }

	private _has_been_visited: boolean = false;
	public get has_been_visited(): boolean { return this._has_been_visited; }

	public get requires_update(): boolean { return this.room_walls.requires_update; }

	public drawable_entities: DrawableEntity[];
	public actionable_entities: ActionableEntity[];
	public taken_spaces: Rect[];

	public set has_been_visited(value: boolean) {
		if (value == null) {
			throw new Error("Property 'has_been_visited' can not be null");
		}
		if (value === false) {
			throw new Error("Cannot un-visit a room");
		}
		this._has_been_visited = value;
	}

	private _has_been_glimpsed: boolean = false;
	public get has_been_glimpsed(): boolean { return this._has_been_glimpsed; }
	public set has_been_glimpsed(value: boolean) {
		if (value == null) {
			throw new Error("Property 'has_been_glimpsed' can not be null");
		}
		if (value === false) {
			throw new Error("Cannot un-glimpse a room");
		}
		this._has_been_glimpsed = value;
	}

	constructor(raw_map: IRawMap, walls: RoomWalls, drawable_entities?: DrawableEntity[]) {
		if (raw_map == null) {
			throw new Error("parameter `raw_map` cannot be null");
		}
		if (walls == null) {
			throw new Error("parameter `wall` cannot be null");
		}

		this._raw_map = raw_map;
		this._room_walls = walls;
		this._tiles = this.get_tiles(this.raw_map, this._room_walls);
		this.drawable_entities = drawable_entities == null ? new Array<DrawableEntity>() : drawable_entities;
		this.actionable_entities = new Array<ActionableEntity>();
		this.taken_spaces = new Array<Rect>();
		this.set_taken_spaces();
	}

	private set_taken_spaces(): void {
		this.taken_spaces = new Array<Rect>();
		this.tiles.forEach(
			tiles_line => {
				tiles_line.forEach(
					tile => {
						if (tile.has_collision) {
							this.taken_spaces.push(new Rect(tile.position.x, tile.position.y, tile.width, tile.height));
						}
					}
				);
			}
		);
		this.taken_spaces.push(new Rect(canvas_W / 2 - 10, canvas_H / 2 - 20, 20, 40)); // Jays spawn
		this.room_walls.doors.forEach(
			door => {
				this.taken_spaces.push(new Rect(
					door.position.x - door.width,
					door.position.y - door.height,
					door.width * 3,
					door.height * 3
				));
			}
		);
	}

	protected get_tiles(raw_map: IRawMap, room_walls: RoomWalls): Tile[][] {
		const result: Tile[][] = [];
		let line: Tile[] = [];
		let tile_coord_x = 0;
		let tile_coord_y = 0;
		for (let i = 0; i < raw_map.tiles.length; i++) {
			const tile_ref = RoomMap.getTileById(raw_map.tiles[i]);
			const tile = new Tile(tile_ref.id, tile_ref.desc, tile_ref.src, tile_ref.has_collision);
			tile.coord_x = tile_coord_x;
			tile.coord_y = tile_coord_y;
			tile.position.x = tile.coord_x * tile.width + room_walls.wall_width;
			tile.position.y = tile.coord_y * tile.height + room_walls.wall_height;
			tile_coord_x++;

			line.push(tile);
			if (i > 0 && ((i + 1) % this.width) === 0) {
				result.push(line);
				line = new Array<Tile>();
				tile_coord_x = 0;
				tile_coord_y++;
			}
		}
		return result;
	}

	public static getTileById(id: number): Tile {
		return TILE_TYPES[id] || TILE_REF;
	}

	public generate_drawable_entity_random_location(type: string) {
		let good_location = false;
		let drawable_entity: DrawableEntity;
		const nbTries = 20;
		let i = 0;
		while (!good_location && i < nbTries) {
			switch (type) {
				case "rock-2":
					drawable_entity = new Rock(2, new Point(
						MathUtil.get_random_int(60, canvas_W - ROCK_2.width - 60),
						MathUtil.get_random_int(60, canvas_H - ROCK_2.height - 60)))
					break;
				default:
					throw new Error("Drawable entity type '" + type + "' doesn't exist");
			}
			good_location = !Collision.is_collision_rects(
				new Rect(drawable_entity.position.x, drawable_entity.position.y, drawable_entity.width, drawable_entity.height),
				this.taken_spaces);
			i++;
		}
		if (i < nbTries) {
			this.drawable_entities.push(drawable_entity);
			this.taken_spaces.push(new Rect(drawable_entity.position.x, drawable_entity.position.y, drawable_entity.width, drawable_entity.height));
		}
	}

	public generate_drawable_entities_random_location(type: string, nb: number, max?: number) {
		nb = max == null ? nb : MathUtil.get_random_int(nb, max);
		for (let i = 0; i < nb; i++) {
			this.generate_drawable_entity_random_location(type);
		}
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		// Draw room walls
		this._room_walls.draw(ctx);
		// Draw each tile
		this.tiles.forEach(tile => tile.forEach(tile => tile.draw(ctx)));
	}
}