import { WARPS, Warp } from "./warp";
import { MAPS } from "./maps";
import { Tile } from "./tile";

export class RoomMap {
	public id: number;
	public floor: number;
	public width: number;
	public height: number;
	public tiles: Tile[][];
	public warps: Warp[];

	constructor(id: number) {
		this.id = id;
		this.floor = MAPS[id].floor;
		this.width = MAPS[id].width;
		this.height = MAPS[id].height;
		this.tiles = new Array<Array<Tile>>();
		this.warps = new Array<Warp>();

		let line = new Array<Tile>();
		let tile_coord_x = 0;
		let tile_coord_y = 0;
		for (let i = 0; i < MAPS[id].tiles.length; i++) {
			const tile_ref = RoomMap.getTileById(MAPS[id].tiles[i]);
			const tile = new Tile(tile_ref.id, tile_ref.desc, tile_ref.src_x, tile_ref.src_y, tile_ref.has_collision);
			tile.coord_x = tile_coord_x;
			tile.coord_y = tile_coord_y;
			tile.pos_x = tile.coord_x * tile.width;
			tile.pos_y = tile.coord_y * tile.height;
			tile_coord_x++;

			line.push(tile);
			if (i > 0 && ((i + 1) % this.width) === 0) {
				this.tiles.push(line);
				line = new Array<Tile>();
				tile_coord_x = 0;
				tile_coord_y++;
			}
		}
	}

	/**
	 * TODO fix this shit
	 * Remove warpmap.ts & warpdesc.ts if necessary
	 */
	public get_warp(): any {
		// I wanted to return a WarpMap using itself a WarpDesc...
		return WARPS.find(warp => warp.map_id === this.id) || null;
	}

	public static getTileById(id: number): Tile {
		return TILE_TYPES[id] || TILE_REF;
	}
}

export const TILE_REF = new Tile(0, "", -1, -1, false);

const TILE_TYPES: { [key: number]: Tile } = {
	1: new Tile(1, "Earth", 0, 0, false),
	2: new Tile(2, "Rock", 1, 0, true),
	3: new Tile(3, "Water", 2, 0, true),
	4: new Tile(4, "Grass", 3, 0, false),
	5: new Tile(5, "Grass textured light", 4, 0, false),
	9: new Tile(9, "Grass light", 3, 1, false),
	10: new Tile(10, "Grass textured", 4, 1, false),
	12: new Tile(12, "Iron", 1, 2, true)
};