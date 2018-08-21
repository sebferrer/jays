import { Tile } from "./tile";
import { WarpInfo } from "./warp_info";

export class CollisionWarp {
	public is_collision: boolean;
	public warp_info: WarpInfo;
	public tile: Tile;
	constructor(is_collision?: boolean, warp_info?: WarpInfo, tile?: Tile) {
		this.is_collision = is_collision;
		this.warp_info = warp_info;
		this.tile = tile;
	}
}