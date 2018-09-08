import { WARPS, Warp } from "../warp";
import { MAPS } from "./maps";
import { Tile } from "./tile";
import { Point } from "../point";
import { IDrawable } from "../idrawable";
import { bank } from "../main";
import { Wall } from "./wall";

export class RoomMap implements IDrawable {
	public id: number;
	public width: number;
	public height: number;
	public tiles: Tile[][];
	public warps: Warp[];
	public wall: Wall;

	constructor(id: number, wall: Wall) {

		if (wall == null) {
			throw new Error("parameter `wall` cannot be null");
		}
		this.wall = wall;

		this.id = id;
		this.width = MAPS[id].width;
		this.height = MAPS[id].height;
		this.tiles = new Array<Array<Tile>>();
		this.warps = new Array<Warp>();

		let line = new Array<Tile>();
		let tile_coord_x = 0;
		let tile_coord_y = 0;
		for (let i = 0; i < MAPS[id].tiles.length; i++) {
			const tile_ref = RoomMap.getTileById(MAPS[id].tiles[i]);
			const tile = new Tile(tile_ref.id, tile_ref.desc, tile_ref.src, tile_ref.has_collision);
			tile.coord_x = tile_coord_x;
			tile.coord_y = tile_coord_y;
			tile.pos.x = tile.coord_x * tile.width;
			tile.pos.y = tile.coord_y * tile.height;
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

	public draw(ctx: CanvasRenderingContext2D): void {

		this.wall.draw(ctx);

		const pic = bank.pic["assets/img/tiles.png"];

		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				const tile = this.tiles[i][j];
				ctx.drawImage(pic,
					tile.src.x * tile.height, tile.src.y * tile.width,
					tile.width, tile.height,
					tile.pos.x + this.wall.side_sprite.width, tile.pos.y + this.wall.side_sprite.height,
					tile.width, tile.height);
			}
		}
	}
}

export const TILE_REF = new Tile(0, "", new Point(-1, -1), false);

const TILE_TYPES: { [key: number]: Tile } = {
	1: new Tile(1, "Earth", new Point(0, 0), false),
	2: new Tile(2, "Rock", new Point(1, 0), true),
	3: new Tile(3, "Water", new Point(2, 0), true),
	4: new Tile(4, "Grass", new Point(3, 0), false),
	5: new Tile(5, "Grass textured light", new Point(4, 0), false),
	9: new Tile(9, "Grass light", new Point(3, 1), false),
	10: new Tile(10, "Grass textured", new Point(4, 1), false),
	12: new Tile(12, "Iron", new Point(1, 2), true)
};