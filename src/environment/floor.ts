import { Door } from "./walls/door";

export class Floor {
	public id: number;
	public tile_map: string;
	public music: string;
	constructor(id: number, tile_map: string, music: string) {
		this.id = id;
		this.tile_map = tile_map;
		this.music = music;
	}

	public on_collision_warp(door: Door) {
		/*tslint:disable */
		console.log("warp, direction: " + door.direction);
		/*tslint:enable*/
	}
}