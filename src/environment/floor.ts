import { Door } from "./walls/door";
import { RoomMap } from "./rooms/room_map";
import { Point } from "../point";
import { FourFireRoom } from "./rooms/four_fire_room";
import { Direction } from "../enum";
import { gameState, canvas_H, canvas_W, renderer } from "../main";
import { FloorMap } from "./floor_map";

export class Floor {
	public id: number;
	public tile_map: string;
	public music: string;

	public floor_map: FloorMap;

	constructor(id: number, tile_map: string, music: string) {
		this.id = id;
		this.tile_map = tile_map;
		this.music = music;
		this.floor_map = new FloorMap();
	}

	public initialize(): void {
		// Draw minimap
		this.floor_map.next_room();
		renderer.update_minimap(this.floor_map);
	}

	public on_collision_warp(door: Door) {

		/*tslint:disable */
		console.log("warp, direction: " + door.direction);
		/*tslint:enable*/

		// Remove tears
		gameState.tears.splice(0, gameState.tears.length);

		switch (door.direction) {
			case Direction.LEFT:
				gameState.jays.position = new Point(canvas_W - 60 - gameState.jays.width, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.RIGHT:
				gameState.jays.position = new Point(60 + gameState.jays.width, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.UP:
				gameState.jays.position = new Point((canvas_W / 2) - (gameState.jays.width / 2), canvas_H - 60 - gameState.jays.height / 2);
				break;
			case Direction.DOWN:
				gameState.jays.position = new Point((canvas_W / 2) - (gameState.jays.width / 2), 60 + gameState.jays.height / 2);
				break;
		}

		gameState.current_map = this.floor_map.next_room(door.direction);

		// Re-draw minimap
		renderer.update_minimap(this.floor_map);
	}

	private glimpse(): void {
		const position = this.floor_map.current_position;
	}
}