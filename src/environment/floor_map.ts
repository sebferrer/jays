import { IDrawable } from "../idrawable";
import { Point } from "../point";
import { RoomMap } from "./rooms/room_map";
import { Direction } from "../enum";
import { FourFireRoom } from "./rooms/four_fire_room";
import { WaterLeftRightRoom } from "./rooms/water_left_right_room";
import { EmptyGrassRoom } from "./rooms/empty_grass_room";
import { DeadEndRightRoom } from "./rooms/dead_end_right_room";
import { renderer, IMAGE_BANK } from "../main";
import { IMiniMapColorConfig, IMiniMapConfiguration, IMiniMapSizeConfig } from "./iminimap_configuration";
import { BossRoom } from "./rooms/boss_room";
import { IIConRoom, isIIConRoom } from "./iicon_room";

const MINIMAP_CONFIG: IMiniMapConfiguration = {
	colors: <IMiniMapColorConfig>{
		visited_border: "#aaaaaa",
		visited_fill: "#ffffff55",

		not_visited_border: "#aaaaaa",
		not_visited_fill: "#000000",

		active_border: "#ffffffaa",
		active_fill: "#ffffff"
	},
	sizes: <IMiniMapSizeConfig>{
		room_width: 26,
		room_height: 26,
		room_margin: 4
	}
};

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
		this.maps_grid[2][4] = new BossRoom([Direction.LEFT]);

		this.maps_grid[3][2] = new WaterLeftRightRoom([Direction.UP]);
		this.maps_grid[2][1] = new EmptyGrassRoom([Direction.RIGHT, Direction.UP, Direction.LEFT]);
		this.maps_grid[2][0] = new DeadEndRightRoom([Direction.RIGHT]);
		this.maps_grid[1][1] = new WaterLeftRightRoom([Direction.DOWN]);
	}

	public draw(context: CanvasRenderingContext2D, config: IMiniMapConfiguration = MINIMAP_CONFIG): void {

		for (let x = 0; x < this.maps_grid.length; ++x) {
			for (let y = 0; y < this.maps_grid[x].length; ++y) {
				const current = this.maps_grid[y][x];
				if (current == null) {
					continue;
				}

				if (current === this.current_room) {
					context.strokeStyle = config.colors.active_border;
					context.fillStyle = config.colors.active_fill;
					context.lineWidth = 2;
				} else if (current.has_been_visited) {
					context.strokeStyle = config.colors.visited_border;
					context.fillStyle = config.colors.visited_fill;
					context.lineWidth = 1;
				} else {
					context.strokeStyle = config.colors.not_visited_border;
					context.fillStyle = config.colors.not_visited_fill;
					context.lineWidth = 1;
				}

				const destination = new Point(
					(config.sizes.room_width + config.sizes.room_margin) * x + config.sizes.room_margin,
					(config.sizes.room_height + config.sizes.room_margin) * y + config.sizes.room_margin,
				);

				renderer.fill_round_rect(context, destination.x, destination.y, config.sizes.room_width, config.sizes.room_height, 3);
				renderer.stroke_round_rect(context, destination.x, destination.y, config.sizes.room_width, config.sizes.room_height, 3);

				// if (isIIConRoom(current)) {
				// 	const icon_room = current as IIConRoom;
				// 	context.drawImage(
				// 		IMAGE_BANK.pic[icon_room.icon.sprite_sheet_path],
				// 		icon_room.icon.top_left.x, icon_room.icon.top_left.y,
				// 		icon_room.icon.width, icon_room.icon.height,
				// 		config.sizes.room_width / 2 - icon_room.icon.width / 2,
				// 		config.sizes.room_height / 2 - icon_room.icon.width / 2,
				// 		icon_room.icon.width, icon_room.icon.height
				// 	);
				// }
			}
		}
	}
}