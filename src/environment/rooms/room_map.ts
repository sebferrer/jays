import { Warp } from "../../warp";
import { Tile, TILE_TYPES, TILE_REF } from "../tile";
import { IDrawable } from "../../idrawable";
import { RoomWalls } from "../walls/room_walls";
import { IRawMap } from "../irawmap";

export abstract class RoomMap implements IDrawable {

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

	public warps: Warp[];

	private _has_been_visited: boolean = false;
	public get has_been_visited(): boolean { return this._has_been_visited; }
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

	constructor(raw_map: IRawMap, wall: RoomWalls) {
		if (raw_map == null) {
			throw new Error("parameter `raw_map` cannot be null");
		}
		if (wall == null) {
			throw new Error("parameter `wall` cannot be null");
		}

		this._raw_map = raw_map;
		this._room_walls = wall;
		this.warps = new Array<Warp>();
		this._tiles = this.get_tiles(this.raw_map, this._room_walls);
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

	public draw(ctx: CanvasRenderingContext2D): void {
		// Draw room walls
		this._room_walls.draw(ctx);
		// Draw each tile
		this.tiles.forEach(tile => tile.forEach(tile => tile.draw(ctx)));
	}
}