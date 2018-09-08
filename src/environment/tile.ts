import { gameState } from "./../main";
import { TileType } from "./../enum";
import { WarpInfo } from "./../warp_info";
import { Point } from "./../point";
import { IDrawable } from "./../idrawable";
import { bank } from "../main";

export class Tile implements IDrawable {

	public width: number;
	public height: number;
	public id: number;
	public desc: string;
	public src: Point;
	public coord_x: number;
	public coord_y: number;
	public pos: Point;
	public has_collision: boolean;
	public warp_info: WarpInfo;
	public type: TileType;
	public anim: number[]; // IDs of the tiles dedicated to animation

	constructor(id: number, desc: string, src: Point, has_collision: boolean) {
		this.width = 20;
		this.height = 20;
		this.id = id;
		this.desc = desc;
		this.src = new Point(src.x, src.y);
		this.pos = new Point();
		this.has_collision = has_collision;
		this.anim = new Array<number>(); // If primary, contains all the animated tiles IDs
	}

	public same_coords(tile: Tile): boolean {
		return this.coord_x === tile.coord_x && this.coord_y === this.coord_y;
	}

	public same_coords_array(array: Tile): boolean {
		return this.coord_x === array[0] && this.coord_y === array[1];
	}

	public get_warp_info(): WarpInfo | null {
		const warp = gameState.current_map.get_warp();
		if (warp != null) {
			const tile = this;
			for (let i = 0; i < warp.zones.length; i++) {
				for (let j = 0; j < warp.zones[i].tiles.length; j++) {
					if (tile.same_coords_array(warp.zones[i].tiles[j])) {
						return new WarpInfo(warp.zones[i].destination, warp.zones[i].type);
					}
				}
			}
		}
		return null;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		//TODO: "assets/img/tiles.png" should be an attribute, so we can use whatever sprite sheet we want
		ctx.drawImage(bank.pic["assets/img/tiles.png"],
			this.src.x * this.height, this.src.y * this.width,
			this.width, this.height,
			this.pos.x, this.pos.y,
			this.width, this.height);
	}
}

export const TILE_REF = new Tile(0, "", new Point(-1, -1), false);

export const TILE_TYPES: { [key: number]: Tile } = {
	1: new Tile(1, "Earth", new Point(0, 0), false),
	2: new Tile(2, "Rock", new Point(1, 0), true),
	3: new Tile(3, "Water", new Point(2, 0), true),
	4: new Tile(4, "Grass", new Point(3, 0), false),
	5: new Tile(5, "Grass textured light", new Point(4, 0), false),
	9: new Tile(9, "Grass light", new Point(3, 1), false),
	10: new Tile(10, "Grass textured", new Point(4, 1), false),
	12: new Tile(12, "Iron", new Point(1, 2), true)
};