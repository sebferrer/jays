import { IDrawable } from "../idrawable";
import { Point } from "../point";
import { RoomMap } from "./rooms/room_map";
import { Direction } from "../enum";
import { FourFireRoom } from "./rooms/four_fire_room";
import { WaterLeftRightRoom } from "./rooms/water_left_right_room";
import { EmptyGrassRoom } from "./rooms/empty_grass_room";
import { DeadEndRightRoom } from "./rooms/dead_end_right_room";

enum MiniMapColors {
	visited_border = "#aaaaaa",
	visited_fill = "#ffffff55",

	not_visited_border = "#aaaaaa",
	not_visited_fill = "#000000",

	active_border = "#ffffffaa",
	active_fill = "#ffffff",
}

export class FloorMap implements IDrawable {
	public maps_grid: Array<RoomMap[]>;


	public get current_room(): RoomMap { return this.maps_grid[this.current_position.x][this.current_position.y]; }

	/** Position on the current map */
	public current_position: Point;

	private max_floor_map_height = 5;
	private max_floor_map_width = 5;

	constructor() {
		// Generate a static map, for now

		this.maps_grid = new Array<RoomMap[]>(this.max_floor_map_height);
		for (let i = 0; i < this.max_floor_map_height; ++i) {
			this.maps_grid[i] = new Array<RoomMap>(this.max_floor_map_width);
		}

		this.current_position = new Point(2, 2);

		this.maps_grid[2][2] = new FourFireRoom([Direction.LEFT, Direction.DOWN, Direction.RIGHT]);
		this.maps_grid[2][3] = new EmptyGrassRoom([Direction.LEFT, Direction.RIGHT]);
		this.maps_grid[2][4] = new EmptyGrassRoom([Direction.LEFT]);

		this.maps_grid[3][2] = new WaterLeftRightRoom([Direction.UP]);
		this.maps_grid[2][1] = new EmptyGrassRoom([Direction.RIGHT, Direction.UP, Direction.LEFT]);
		this.maps_grid[2][0] = new DeadEndRightRoom([Direction.RIGHT]);
		this.maps_grid[1][1] = new WaterLeftRightRoom([Direction.DOWN]);
	}

	public draw(ctx: CanvasRenderingContext2D): void {

		for (let x = 0; x < this.maps_grid.length; ++x) {
			for (let y = 0; y < this.maps_grid[x].length; ++y) {
				const current = this.maps_grid[y][x];
				if (current == null) {
					continue;
				}

				if (current === this.current_room) {
					ctx.strokeStyle = MiniMapColors.active_border;
					ctx.fillStyle = MiniMapColors.active_fill;
					ctx.lineWidth = 2;
				} else if (current.has_been_visited) {
					ctx.strokeStyle = MiniMapColors.visited_border;
					ctx.fillStyle = MiniMapColors.visited_fill;
					ctx.lineWidth = 1;
				} else {
					ctx.strokeStyle = MiniMapColors.not_visited_border;
					ctx.fillStyle = MiniMapColors.not_visited_fill;
					ctx.lineWidth = 1;
				}

				ctx.fillRect(30 * x + 4, 30 * y + 4, 26, 26);
				ctx.strokeRect(30 * x + 4, 30 * y + 4, 26, 26);
			}
		}
	}
}