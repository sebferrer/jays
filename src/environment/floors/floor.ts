import { AudioFile } from "../../audio_file";
import { Direction } from "../../enum";
import { canvas_H, canvas_W, gameState, renderer } from "../../main";
import { Point } from "../../point";
import { FloorMap } from "../floor_map";
import { Door } from "../walls/door";
import { get_room_map_definitions, RoomMapDefinition } from "../rooms/room_map_definition.decorator";

export abstract class Floor {
	public abstract get level(): number;
	public abstract get name(): string;

	// NB: music can't be played if the user hasn't interacted with the page. Otherwise: 
	// DOMException: play() failed because the user didn’t interact with the document first
	public abstract get base_music(): AudioFile;
	// public abstract get available_rooms(): RoomMap[];

	protected _floor_map: FloorMap;
	public get floor_map(): FloorMap { return this._floor_map; }

	protected abstract _available_rooms: any[];
	public get available_rooms(): RoomMapDefinition[] { return get_room_map_definitions(this._available_rooms); }

	constructor() { }

	public initialize(): void {
		this._floor_map = new FloorMap(this);
		// Draw minimap
		this.floor_map.next_room();

		renderer.update_minimap(this.floor_map);
	}

	public on_collision_warp(door: Door) {

		// Remove tears
		gameState.tears.splice(0, gameState.tears.length);

		gameState.current_room = this.floor_map.next_room(door.direction);
		renderer.update_current_room(gameState.current_room);

		switch (door.direction) {
			case Direction.LEFT:
				gameState.jays.position = new Point(canvas_W - gameState.current_room.room_walls.wall_height - gameState.jays.width, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.RIGHT:
				gameState.jays.position = new Point(60, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.UP:
				gameState.jays.position = new Point((canvas_W / 2) - (gameState.jays.width / 2), canvas_H - gameState.current_room.room_walls.wall_height - gameState.jays.height);
				break;
			case Direction.DOWN:
				gameState.jays.position = new Point((canvas_W / 2) - (gameState.jays.width / 2), gameState.current_room.room_walls.wall_height);
				break;
		}

		// Re-draw minimap
		renderer.update_minimap(this.floor_map);
	}

	// public get_available_rooms(): RoomMapDefinition[] {
	// 	const a = typeof(RoomMap);
	// }
}