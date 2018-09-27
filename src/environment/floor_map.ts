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
import { ICustomRoom, isCustomRoom } from "./iicon_room";

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
		room_width: 30,
		room_height: 30,
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
				const room = this.maps_grid[y][x];
				if (room == null) {
					continue;
				}

				const position = new Point(x, y);
				if (isCustomRoom(room)) {
					this.draw_custom_room(context, room, config, position);
				} else {
					this.draw_standard_room(context, room, config, position);
				}
			}
		}
	}

	private draw_standard_room(
		context: CanvasRenderingContext2D,
		room: RoomMap,
		config: IMiniMapConfiguration,
		position: Point
	) {
		if (room === this.current_room) {
			context.strokeStyle = config.colors.active_border;
			context.fillStyle = config.colors.active_fill;
			context.lineWidth = 2;
		} else if (room.has_been_visited) {
			context.strokeStyle = config.colors.visited_border;
			context.fillStyle = config.colors.visited_fill;
			context.lineWidth = 1;
		} else {
			context.strokeStyle = config.colors.not_visited_border;
			context.fillStyle = config.colors.not_visited_fill;
			context.lineWidth = 1;
		}

		const destination = new Point(
			(config.sizes.room_width + config.sizes.room_margin) * position.x + config.sizes.room_margin,
			(config.sizes.room_height + config.sizes.room_margin) * position.y + config.sizes.room_margin,
		);

		renderer.fill_round_rect(context, destination.x, destination.y, config.sizes.room_width, config.sizes.room_height, 3);
		renderer.stroke_round_rect(context, destination.x, destination.y, config.sizes.room_width, config.sizes.room_height, 3);
	}

	private draw_custom_room(
		context: CanvasRenderingContext2D,
		room: RoomMap & ICustomRoom,
		base_config: IMiniMapConfiguration,
		position: Point
	) {
		const destination = new Point(
			(base_config.sizes.room_width + base_config.sizes.room_margin) * position.x + base_config.sizes.room_margin,
			(base_config.sizes.room_height + base_config.sizes.room_margin) * position.y + base_config.sizes.room_margin,
		);

		const config = this.merge_color_config(base_config, room.color_configuration);

		this.draw_standard_room(context, room, config, position);

		const icon_room = room as ICustomRoom;
		context.drawImage(
			IMAGE_BANK.pictures[icon_room.icon.sprite_sheet_path],
			icon_room.icon.top_left.x, icon_room.icon.top_left.y,
			icon_room.icon.width, icon_room.icon.height,
			destination.x + (base_config.sizes.room_width - icon_room.icon.width) / 2,
			destination.y + (base_config.sizes.room_height - icon_room.icon.height) / 2,
			icon_room.icon.width, icon_room.icon.height
		);
	}

	private merge_color_config(
		base_config: IMiniMapConfiguration,
		color_configuration: IMiniMapColorConfig
	): IMiniMapConfiguration {
		const result = <IMiniMapConfiguration>{ sizes: {}, colors: {} };
		Object.keys(base_config.sizes).forEach(object_key => result.sizes[object_key] = base_config.sizes[object_key]);
		Object.keys(base_config.colors).forEach(key => {
			result.colors[key] = color_configuration[key] != null ? color_configuration[key] : base_config.colors[key];
		});
		return result;
	}
}