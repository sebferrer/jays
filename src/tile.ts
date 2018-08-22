import { gameState } from "./main";
import { TileType } from "./enum";
import { WarpInfo } from "./warp_info";

export class Tile {

	public width: number;
	public height: number;
	public id: number;
	public desc: string;
	public src_x: number;
	public src_y: number;
	public coord_x: number;
	public coord_y: number;
	public pos_x: number;
	public pos_y: number;
	public has_collision: boolean;
	public warp_info: WarpInfo;
	public type: TileType;
	public anim: number[]; // IDs of the tiles dedicated to animation

	constructor(id: number, desc: string, src_x: number, src_y: number, has_collision: boolean) {
		this.width = 20;
		this.height = 20;
		this.id = id;
		this.desc = desc;
		this.src_x = src_x;
		this.src_y = src_y;
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
}