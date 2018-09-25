import { IDrawable } from "../idrawable";
import { Point } from "../point";
import { RoomMap } from "./rooms/room_map";
import { Direction } from "../enum";
import { FourFireRoom } from "./rooms/four_fire_room";
import { WaterLeftRightRoom } from "./rooms/water_left_right_room";
import { EmptyGrassRoom } from "./rooms/empty_grass_room";
import { DeadEndRightRoom } from "./rooms/dead_end_right_room";
import { canvas_W, canvas_H } from "../main";

export class FloorMap implements IDrawable {
	public floor_map: Array<RoomMap[]>;

	/** Position on the current map */
	public current_position: Point;

	private max_floor_map_height = 5;
	private max_floor_map_width = 5;

	constructor() {
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

	public draw(ctx: CanvasRenderingContext2D): void {
		for (let x = 0; x < this.floor_map.length; ++x) {
			for (let y = 0; y < this.floor_map[x].length; ++y) {
				const current = this.floor_map[y][x];
				if (current != null) {

					if(current === this.floor_map[this.current_position.x][this.current_position.y]) {
						ctx.strokeStyle = "white";
						ctx.lineWidth = 2;
					} else {
						ctx.strokeStyle = "black";
						ctx.lineWidth = 1;
					}
					ctx.strokeRect(20 * x + 1 + canvas_W - 20 * this.max_floor_map_width, 20 * y + 1 / 2, 17, 17);
				}
			}
		}
		ctx.stroke();
		ctx.restore();
	}
}