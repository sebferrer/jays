import { Door } from "./walls/door";
import { RoomMap } from "./rooms/room_map";
import { Point } from "../point";
import { FourFireRoom } from "./rooms/four_fire_room";
import { Direction } from "../enum";
import { EmptyGrassRoom } from "./rooms/empty_grass_room";
import { gameState, canvas_H, canvas_W } from "../main";
import { WaterLeftRightRoom } from "./rooms/water_left_right_room";
import { DeadEndRightRoom } from "./rooms/dead_end_right_room";

export class Floor {
	public id: number;
	public tile_map: string;
	public music: string;

	public floor_map: Array<RoomMap[]>;

	/** Position on the current map */
	public current_position: Point;

	private max_floor_map_height = 5;
	private max_floor_map_width = 5;

	constructor(id: number, tile_map: string, music: string) {
		this.id = id;
		this.tile_map = tile_map;
		this.music = music;

		// Generate a static map, for now

		this.floor_map = new Array<RoomMap[]>(this.max_floor_map_height);
		for (let i = 0; i < this.max_floor_map_height; ++i) {
			this.floor_map[i] = new Array<RoomMap>(this.max_floor_map_width);
		}

		this.current_position = new Point(2, 2);

		this.floor_map[2][2] = new FourFireRoom([Direction.LEFT, Direction.DOWN]);
		this.floor_map[3][2] = new WaterLeftRightRoom([Direction.UP]);
		this.floor_map[2][1] = new EmptyGrassRoom([Direction.RIGHT, Direction.UP, Direction.LEFT]);
		this.floor_map[2][0] = new DeadEndRightRoom([Direction.RIGHT]);
		this.floor_map[1][1] = new WaterLeftRightRoom([Direction.DOWN]);
	}

	public on_collision_warp(door: Door) {

		/*tslint:disable */
		console.log("warp, direction: " + door.direction);
		/*tslint:enable*/

		switch (door.direction) {
			case Direction.LEFT:
				this.current_position.y--;
				gameState.jays.pos = new Point(canvas_W - 60 - gameState.jays.width, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.RIGHT:
				this.current_position.y++;
				gameState.jays.pos = new Point(60 + gameState.jays.width, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.UP:
				this.current_position.x--;
				gameState.jays.pos = new Point((canvas_W / 2) - (gameState.jays.width / 2), canvas_H - 60 - gameState.jays.height / 2);
				break;
			case Direction.DOWN:
				this.current_position.x++;
				gameState.jays.pos = new Point((canvas_W / 2) - (gameState.jays.width / 2), 60 + gameState.jays.height / 2);
				break;
		}

		gameState.current_map = this.floor_map[this.current_position.x][this.current_position.y];


	}
}