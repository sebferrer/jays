import { Direction } from "../enum";
import { Floor } from "./floors/floor";
import { EmptyGrassRoom } from "./rooms/empty_grass_room";
import { RoomMap } from "./rooms/room_map";
import { Point } from "../point";
import { ArrayUtil, MathUtil } from "../util";
import { FourFireRoom } from "./rooms/four_fire_room";
import { get_room_map_definitions } from "./rooms/room_map_definition.decorator";

export class GridGenerationResult {
	constructor(public grid: boolean[][], public init_point: Point) { }
}

export class MapGenerator {

	public generate_grid(max_grid_width: number, max_grid_height: number, big_map = false): GridGenerationResult {
		const first_pathes_max_length = big_map ? 12 : 6;

		// Create 2D array filled with false
		const grid = new Array<boolean[]>(max_grid_height);
		for (let y = 0; y < max_grid_height; ++y) {
			grid[y] = new Array<boolean>(max_grid_width).fill(false);
		}

		// Point where the player will spawn
		const init_point = new Point(Math.round(max_grid_height / 2), Math.round(max_grid_width / 2));
		let current_point = Point.copy(init_point);

		const first_path = new Array<Point>();
		let path = new Array<Point>();
		first_path.push(Point.copy(current_point));
		path.push(Point.copy(current_point));
		grid[current_point.y][current_point.y] = true;

		// First random path
		for (let i = 0; i < first_pathes_max_length; ++i) {
			const possible_directions = this.get_possible_directions(current_point, grid);
			current_point = this.get_next_point(current_point, possible_directions);
			if (!grid[current_point.y][current_point.x]) {
				grid[current_point.y][current_point.x] = true;
				first_path.push(Point.copy(current_point));
				path.push(Point.copy(current_point));
			}
		}

		// Ramifications from the first random path
		first_path.forEach(first_path_point => {
			current_point = first_path_point;
			for (let i = 0; i < first_pathes_max_length; ++i) {
				const possible_directions = this.get_possible_directions(first_path_point, grid);
				current_point = this.get_next_point(first_path_point, possible_directions);
				if (!grid[current_point.y][current_point.x]) {
					grid[current_point.y][current_point.x] = true;
					path.push(current_point);
				}
			}
		});

		for (let i = 0; i < path.length; ++i) {
			const point = path[i];
			let surrounding = this.get_surrounding_removable(point, init_point, grid);
			if (surrounding == null || surrounding.length === 0) {
				continue;
			}
			for (let j = 0; j < 2; ++j) {
				const rand_surrounding = surrounding[MathUtil.get_random_int(surrounding.length)];
				const tmp_result = grid.map(row => row.map(cell => cell ? 1 : 0));
				tmp_result[rand_surrounding.y][rand_surrounding.x] = 0;
				const tmp_path = path.filter(p => !p.equals(rand_surrounding)).map(p => Point.copy(p));

				if (this.is_connected(init_point, tmp_path, tmp_result)) {
					grid[rand_surrounding.y][rand_surrounding.x] = false;
					path = path.filter(p => !p.equals(rand_surrounding));
					surrounding = path[i] == null ? null : this.get_surrounding_removable(point, init_point, grid);
					if (surrounding == null) {
						break;
					}
				} else {
					surrounding = surrounding.filter(p => !p.equals(rand_surrounding));
					if (surrounding.length === 0) {
						break;
					}
					--j;
				}
			}
		}
		const trim_result = ArrayUtil.trim(grid);

		// The grid has been trimmed: the init_point may have changed position
		init_point.x -= trim_result.left;
		init_point.y -= trim_result.top;

		return new GridGenerationResult(grid, init_point);
	}

	public generate_rooms(grid: boolean[][], floor: Floor): RoomMap[][] {
		const result = new Array<RoomMap[]>(grid.length);

		const available_rooms = floor.available_rooms;

		for (let y = 0; y < grid.length; ++y) {
			result[y] = new Array<RoomMap>(grid[y].length);
			for (let x = 0; x < grid[y].length; ++x) {
				if (grid[y][x]) {
					const doors_directions = this.get_possible_directions(new Point(x, y), grid, true);

					// Get the rooms which can have doors there
					const possible_rooms = available_rooms.filter(definition => {
						return doors_directions.filter(direction => definition.possible_door_positions.has(direction)).length === doors_directions.length;
					});

					const rand = MathUtil.get_random_int(possible_rooms.length);
					result[y][x] = possible_rooms[rand].get_room_map(doors_directions);
				}
			}
		}
		return result;
	}

	private is_connected(current_point: Point, path: Array<Point>, bool_array: Array<Array<number>>): boolean {
		return path.length === ArrayUtil.find_nb_connected(current_point.y, current_point.x, bool_array);
	}

	private get_possible_directions(cur: Point, grid: Array<boolean[]>, check_value = false): Direction[] {
		const result = new Array<Direction>();
		if (cur.x > 0 && (!check_value || grid[cur.y][cur.x - 1])) {
			result.push(Direction.LEFT);
		}
		if (cur.x < grid[cur.y].length - 1 && (!check_value || grid[cur.y][cur.x + 1])) {
			result.push(Direction.RIGHT);
		}
		if (cur.y > 0 && (!check_value || grid[cur.y - 1][cur.x])) {
			result.push(Direction.UP);
		}
		if (cur.y < grid.length - 1 && (!check_value || grid[cur.y + 1][cur.x])) {
			result.push(Direction.DOWN);
		}
		return result;
	}

	private get_next_point(cur: Point, possible_directions: Direction[]): Point {
		let point: Point;
		switch (possible_directions[MathUtil.get_random_int(possible_directions.length)]) {
			case Direction.LEFT: point = new Point(cur.x - 1, cur.y); break;
			case Direction.RIGHT: point = new Point(cur.x + 1, cur.y); break;
			case Direction.DOWN: point = new Point(cur.x, cur.y + 1); break;
			case Direction.UP: point = new Point(cur.x, cur.y - 1); break;
		}
		return point;
	}

	// PÂTÉ DETECTOR

	private get_surrounding_removable(target_point: Point, init_point: Point, grid: boolean[][]): Array<Point> {
		const surroundings = this.get_surrounding(target_point, grid);
		return surroundings.length < 6 ? null : surroundings.filter(p => !p.equals(init_point));
	}

	private get_surrounding(target_point: Point, grid: boolean[][]): Array<Point> {
		const surrounding = new Array<Point>();
		const rowLimit = grid.length - 1;
		const columnLimit = grid[0].length - 1;

		for (var x = Math.max(0, target_point.x - 1); x <= Math.min(target_point.x + 1, rowLimit); x++) {
			for (var y = Math.max(0, target_point.y - 1); y <= Math.min(target_point.y + 1, columnLimit); y++) {
				const current = new Point(x, y);
				if (grid[y][x] && !current.equals(target_point)) {
					surrounding.push(current);
				}
			}
		}
		return surrounding;
	}
}