import { Direction } from "../enum";
import { IDrawable } from "../idrawable";
import { IMAGE_BANK, renderer } from "../main";
import { Point } from "../point";
import { MathUtil, PointUtil } from "../util";
import { ICustomRoom, isCustomRoom } from "./iicon_room";
import { IMiniMapColorConfig, IMiniMapConfiguration, IMiniMapSizeConfig } from "./iminimap_configuration";
import { EmptyGrassRoom } from "./rooms/empty_grass_room";
import { RoomMap } from "./rooms/room_map";

const MINIMAP_CONFIG: IMiniMapConfiguration = {
	colors: <IMiniMapColorConfig>{
		visited_border: "#000",
		visited_fill: "#ffffff",
		
		not_visited_border: "#000",
		not_visited_fill: "#ffffff",
		
		glimpsed_border: "#000",
		glimpsed_fill: "#fff",
		
		active_border: "#000",
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
	
	public get current_room(): RoomMap { return this.maps_grid[this.current_position.y][this.current_position.x]; }
	
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
	
	private path: Array<Point>;
	
	constructor() {
		this.generate_maps_grid();
	}

	public generate_maps_grid() {
		this.maps_grid = new Array<RoomMap[]>(this.max_floor_map_height);
		for (let i = 0; i < this.max_floor_map_height; ++i) {
			this.maps_grid[i] = new Array<RoomMap>(this.max_floor_map_width);
		}
		
		this.current_position = new Point(2, 2);
		
		const first_path = new Array<Point>();
		this.path = new Array<Point>();			
		let cur = new Point(this.current_position.x, this.current_position.y);
		this.maps_grid[this.current_position.y][this.current_position.x] = new EmptyGrassRoom([Direction.LEFT, Direction.RIGHT, Direction.DOWN, Direction.UP]);
		this.path.push(new Point(this.current_position.x, this.current_position.y));
		
		// First rando path
		for (let i = 0; i < 5; ++i) {
			const possible_directions = this.get_possible_directions(cur, this.maps_grid);
			cur = this.next_point(cur, possible_directions).point;
			if (this.maps_grid[cur.y][cur.x] == null) {
				this.maps_grid[cur.y][cur.x] = new EmptyGrassRoom([Direction.LEFT, Direction.RIGHT, Direction.DOWN, Direction.UP]);
				first_path.push(new Point(cur.x, cur.y));
				this.path.push(new Point(cur.x, cur.y));
			}
		}
		
		// Ramifications from the first random path
		for (let i = 0; i < first_path.length; ++i) {
			cur = new Point(first_path[i].x, first_path[i].y);
			for (let j = 0; j < 6; ++j) {
				const possible_directions = this.get_possible_directions(cur, this.maps_grid);
				cur = this.next_point(cur, possible_directions).point;
				if (this.maps_grid[cur.y][cur.x] == null) {
					this.maps_grid[cur.y][cur.x] = new EmptyGrassRoom([Direction.LEFT, Direction.RIGHT, Direction.DOWN, Direction.UP]);
					this.path.push(new Point(cur.x, cur.y));
				}
			}
		}
		
		// When compact blocs detected, removes randomly 2 room_map from the center of the bloc,
		// if it doesn't break the floor_map
		for (let i = 0; i < this.path.length; i++) {
			let surrounding = this.get_surrounding_removable(this.maps_grid, this.path[i]);
			if (surrounding != null) {
				this.maps_grid[this.path[i].y][this.path[i].x] = new EmptyGrassRoom([Direction.LEFT, Direction.RIGHT, Direction.DOWN, Direction.UP]);
				for (let j = 0; j < 2; j++) {
					const rand = MathUtil.getRandomInt(surrounding.length);
					const bool_maps_grid_tmp = this.maps_grid_to_boolean();

					bool_maps_grid_tmp[surrounding[rand].y][surrounding[rand].x] = 0;
					let path_tmp = this.point_array_copy(this.path);
					path_tmp = PointUtil.removeFromArray(this.path, new Point(surrounding[rand].x, surrounding[rand].y));

					if(this.is_connected(path_tmp, bool_maps_grid_tmp)) {
						this.maps_grid[surrounding[rand].y][surrounding[rand].x] = null;
						this.path = PointUtil.removeFromArray(this.path, new Point(surrounding[rand].x, surrounding[rand].y));
						surrounding = this.path[i] == null ? null : this.get_surrounding_removable(this.maps_grid, this.path[i]);
						if(surrounding == null) {
							break;
						}
					}
					else {
						this.maps_grid[surrounding[rand].y][surrounding[rand].x] = new EmptyGrassRoom([Direction.LEFT, Direction.RIGHT, Direction.DOWN, Direction.UP]);
						surrounding = PointUtil.removeFromArray(surrounding, new Point(surrounding[rand].x, surrounding[rand].y));
						j--;
					}
				}
			}
		}
	}

	public point_array_copy(array1: Array<Point>): Array<Point> {
		const array2 = new Array<Point>();
		for(let i = 0; i < array1.length; i++) {
			array2.push(array1[i]);
		}
		return array2;
	}
	
	public is_connected(path: Array<Point>, bool_array: Array<Array<number>>): boolean {
		return path.length === this.find_nb_connected(this.current_position.x, this.current_position.y, bool_array);
	}
	
	public maps_grid_to_boolean(): Array<Array<number>> {
		const boolean_map = new Array<Array<number>>();
		for(let i = 0; i < 10; i++) {
			const line = new Array<number>();
			for(let j = 0; j < 10; j++) {
				if(this.maps_grid[i][j] == null) {
					line.push(0);
				}
				else {
					line.push(1);
				}
			}
			boolean_map.push(line);
		}
		return boolean_map;
	}
	
	public find_nb_connected(a: number, b: number, z: Array<Array<number>>): number {
		const canUp = (a - 1 >= 0);
		const canDown = (a + 1 < z.length);
		const canRight = (b + 1 < z[0].length);
		const canLeft = (b - 1 >= 0);
		
		const value = z[a][b];
		
		let up = 0;
		let down = 0;
		let right = 0;
		let left = 0;
		
		z[a][b] = 2;
		
		if (canUp && z[a - 1][b] === value) {
			up = this.find_nb_connected(a - 1, b, z);
		}
		if (canDown && z[a + 1][b] === value) {
			down = this.find_nb_connected(a + 1, b, z);
		}
		if (canLeft && z[a][b - 1] === value) {
			left = this.find_nb_connected(a, b - 1, z);
		}
		if (canRight && z[a][b + 1] === value) {
			right = this.find_nb_connected(a, b + 1, z);
		}
		
		return up + left + right + down + 1;
	}

	public next_point(cur: Point, possible_directions: Direction[]): { point: Point, direction: Direction } {
		const direction = possible_directions[MathUtil.getRandomInt(possible_directions.length)];
		let point: Point;
		switch(direction) {
			case Direction.LEFT: point = new Point(cur.x - 1, cur.y); break;
			case Direction.RIGHT: point = new Point(cur.x + 1, cur.y); break;
			case Direction.DOWN: point = new Point(cur.x, cur.y + 1); break;
			case Direction.UP: point = new Point(cur.x, cur.y - 1); break;
		}
		return { point, direction };
	}
	
	public get_possible_directions(cur: Point, grid: Array<RoomMap[]>): Direction[] {
		const result = new Array<Direction>();
		if(cur.x > 0) {
			result.push(Direction.LEFT);
		}
		if(cur.x < grid[cur.y].length - 1) {
			result.push(Direction.RIGHT);
		}
		if(cur.y > 0) {
			result.push(Direction.UP);
		}
		if(cur.y < grid.length - 1) {
			result.push(Direction.DOWN);
		}
		return result;
	}
	
	// Pâté detector
	public get_surrounding(array: Array<RoomMap[]>, p: Point): Array<Point> {
		const surrounding = new Array<Point>();
		
		const rowLimit = array.length - 1;
		const columnLimit = array[0].length - 1;
		
		for (var x = Math.max(0, p.x - 1); x <= Math.min(p.x + 1, rowLimit); x++) {
			for (var y = Math.max(0, p.y - 1); y <= Math.min(p.y + 1, columnLimit); y++) {
				if ((x !== p.x || y !== p.y) && array[y][x] != null) {
					surrounding.push(new Point(x, y));
				}
			}
		}
		return surrounding;
	}

	public get_surrounding_removable(array: Array<RoomMap[]>, p: Point): Array<Point> {
		let surrounding = this.get_surrounding(array, p);
		if (surrounding.length >= 6) {
			for(let j = 0; j < surrounding.length; j++) {
				if ((surrounding[j].equals(this.current_position))) {
					surrounding = PointUtil.removeFromArray(surrounding, new Point(surrounding[j].x, surrounding[j].y));
				}
			}
			return surrounding;
		}
		return null;
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