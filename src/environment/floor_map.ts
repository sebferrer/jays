import { Direction } from "../enum";
import { IDrawable } from "../idrawable";
import { IMAGE_BANK, renderer } from "../main";
import { Point } from "../point";
import { Floor } from "./floors/floor";
import { ICustomRoom, isCustomRoom } from "./iicon_room";
import { IMiniMapConfiguration, IMiniMapRoomColorsConfig, IMiniMapSizeConfig } from "./iminimap_configuration";
import { MapGenerator } from "./map_generator";
import { RoomMap } from "./rooms/room_map";

const MINIMAP_CONFIG: IMiniMapConfiguration = {
	colors: <IMiniMapRoomColorsConfig>{
		visited_border: "#000000aa",
		visited_fill: "#ffffff",

		not_visited_border: "#aaaaaa",
		not_visited_fill: "#00000099",

		glimpsed_border: "#aaaaaa",
		glimpsed_fill: "#00000099",

		active_border: "#00DDFD",
		active_fill: "#001D5A"
	},
	sizes: <IMiniMapSizeConfig>{
		room_width: 30,
		room_height: 30,
		room_margin: 4
	},
	background: "#00000000"
};

export class FloorMap implements IDrawable {
	public maps_grid: Array<RoomMap[]>;

	public get current_room(): RoomMap { return this.maps_grid[this.current_position.y][this.current_position.x]; }

	private _floor: Floor;
	public get floor(): Floor { return this._floor; }

	public get room_to_top(): RoomMap {
		if (this.current_position.y < (this.max_floor_map_height - 1) && this.maps_grid[this.current_position.y + 1][this.current_position.x] != null) {
			return this.maps_grid[this.current_position.y + 1][this.current_position.x];
		}
		return null;
	}
	public get room_to_bottom(): RoomMap {
		if (this.current_position.y > 0 && this.maps_grid[this.current_position.y - 1][this.current_position.x] != null) {
			return this.maps_grid[this.current_position.y - 1][this.current_position.x];
		}
		return null;
	}

	public get room_to_right(): RoomMap {
		if (this.current_position.x < (this.max_floor_map_width - 1) && this.maps_grid[this.current_position.y][this.current_position.x + 1] != null) {
			return this.maps_grid[this.current_position.y][this.current_position.x + 1];
		}
		return null;
	}
	public get room_to_left(): RoomMap {
		if (this.current_position.x > 0 && this.maps_grid[this.current_position.y][this.current_position.x - 1] != null) {
			return this.maps_grid[this.current_position.y][this.current_position.x - 1];
		}
		return null;
	}

	public get adjacent_rooms(): RoomMap[] {
		return [this.room_to_top, this.room_to_bottom, this.room_to_left, this.room_to_right].filter(r => r != null);
	}

	/** Position on the current map */
	public current_position: Point;

	private max_floor_map_height = 10;
	private max_floor_map_width = 10;

	constructor(
		floor: Floor
	) {
		if (floor == null) {
			throw new Error("Parameter 'floor' cannot be null");
		}
		this._floor = floor;

		const map_generator = new MapGenerator();
		const grid_generation_result = map_generator.generate_grid(this.max_floor_map_width, this.max_floor_map_height);
		this.max_floor_map_height = grid_generation_result.grid.length;
		this.max_floor_map_width = grid_generation_result.grid[0].length;
		this.maps_grid = map_generator.generate_rooms(grid_generation_result,  this.floor);
		this.current_position = grid_generation_result.init_point;
	}

	public next_room(direction: Direction = null): RoomMap {
		if (direction != null) {
			switch (direction) {
				case Direction.LEFT: this.current_position.x--; break;
				case Direction.RIGHT: this.current_position.x++; break;
				case Direction.UP: this.current_position.y--; break;
				case Direction.DOWN: this.current_position.y++; break;
				default: throw new Error(`Unknown or invalid direction ${direction}`);
			}
		}

		// Visited
		this.current_room.has_been_visited = true;

		// Glimpse
		this.adjacent_rooms.forEach(room => room.has_been_glimpsed = true);

		return this.current_room;
	}

	public draw(context: CanvasRenderingContext2D, config: IMiniMapConfiguration = MINIMAP_CONFIG): void {
		// Draw minimap background
		context.fillStyle = config.background;
		renderer.fill_round_rect(context,
			context.canvas.width - ((this.max_floor_map_width + 1) * (config.sizes.room_width + config.sizes.room_margin)),
			0,
			(this.max_floor_map_width + 1) * (config.sizes.room_width + config.sizes.room_margin),
			(this.max_floor_map_height + 1) * (config.sizes.room_height + config.sizes.room_margin),
			6
		);

		for (let y = 0; y < this.maps_grid.length; ++y) {
			for (let x = 0; x < this.maps_grid[y].length; ++x) {
				const room = this.maps_grid[y][x];
				if (room == null) {
					continue;
				}

				// TODO: check why the coordinates must be inverted for this to work...
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
			context.lineWidth = 8;
		} else if (room.has_been_visited) {
			context.strokeStyle = config.colors.visited_border;
			context.fillStyle = config.colors.visited_fill;
			context.lineWidth = 1;
		} else if (room.has_been_glimpsed) {
			context.strokeStyle = config.colors.glimpsed_border;
			context.fillStyle = config.colors.glimpsed_fill;
			context.lineWidth = 1;
		} else {
			context.strokeStyle = config.colors.not_visited_border;
			context.fillStyle = config.colors.not_visited_fill;
			context.lineWidth = 1;
		}

		const destination = new Point(
			context.canvas.width - ((config.sizes.room_width + config.sizes.room_margin) * (this.max_floor_map_width - position.x) + config.sizes.room_margin),
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
			context.canvas.width - ((base_config.sizes.room_width + base_config.sizes.room_margin) * (this.max_floor_map_width - position.x) + base_config.sizes.room_margin),
			(base_config.sizes.room_height + base_config.sizes.room_margin) * position.y + base_config.sizes.room_margin,
		);

		const config = this.merge_color_config(base_config, room.color_configuration);

		this.draw_standard_room(context, room, config, position);

		if (/*room.has_been_visited || room.has_been_glimpsed*/ true) {
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
	}

	private merge_color_config(
		base_config: IMiniMapConfiguration,
		color_configuration: IMiniMapRoomColorsConfig
	): IMiniMapConfiguration {
		const result = <IMiniMapConfiguration>{ sizes: {}, colors: {} };
		Object.keys(base_config.sizes).forEach(object_key => result.sizes[object_key] = base_config.sizes[object_key]);
		Object.keys(base_config.colors).forEach(key => {
			result.colors[key] = color_configuration[key] != null ? color_configuration[key] : base_config.colors[key];
		});
		return result;
	}
}