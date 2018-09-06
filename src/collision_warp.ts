import { Tile } from "./environment/tile";
import { WarpInfo } from "./warp_info";

export class CollisionWarp {
	public warp_info: WarpInfo;
	public tile: Tile;
	constructor(warp_info?: WarpInfo, tile?: Tile) {
		this.warp_info = warp_info;
		this.tile = tile;
	}
}