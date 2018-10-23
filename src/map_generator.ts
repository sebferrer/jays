import { Point } from "./point";
import { Direction } from "./enum";
import { MathUtil, PointUtil, ArrayUtil } from "./util";

export class MapGenerator {


	public generate_grid(max_grid_width: number, max_grid_height: number, big_map = false): boolean[][] {
		const first_pathes_max_length = big_map ? 12 : 6;

		// Create 2D array filled with false
		const result = new Array<boolean[]>(max_grid_height);
		for (let y = 0; y < max_grid_height; ++y) {
			result[y] = new Array<boolean>();
			for (let x = 0; x < max_grid_width; ++x) {
				result[y][x] = false;
			}
		}

		const init_point = new Point(Math.round(max_grid_height / 2), Math.round(max_grid_width / 2));
		let current_point = Point.copy(init_point);

		const first_path = new Array<Point>();
		let path = new Array<Point>();
		first_path.push(Point.copy(current_point));
		path.push(Point.copy(current_point));
		result[current_point.y][current_point.y] = true;

		// First random path
		for (let i = 0; i < first_pathes_max_length; ++i) {
			const possible_directions = this.get_possible_directions(current_point, result);
			current_point = this.get_next_point(current_point, possible_directions);
			if (!result[current_point.y][current_point.x]) {
				result[current_point.y][current_point.x] = true;
				first_path.push(Point.copy(current_point));
				path.push(Point.copy(current_point));
			}
		}

		// Ramifications from the first random path
		first_path.forEach(first_path_point => {
			current_point = first_path_point;
			for (let i = 0; i < first_pathes_max_length; ++i) {
				const possible_directions = this.get_possible_directions(first_path_point, result);
				current_point = this.get_next_point(first_path_point, possible_directions);
				if (!result[current_point.y][current_point.x]) {
					result[current_point.y][current_point.x] = true;
					path.push(current_point);
				}
			}
		});

		for (let i = 0; i < path.length; ++i) {
			const point = path[i];
			let surrounding = this.get_surrounding_removable(init_point, result, point);
			if (surrounding == null || surrounding.length === 0) {
				continue;
			}
			for (let j = 0; j < 2; ++j) {
				const rand_surrounding = surrounding[MathUtil.get_random_int(surrounding.length)];
				const tmp_result = result.map(row => row.map(cell => cell ? 1 : 0));
				tmp_result[rand_surrounding.y][rand_surrounding.x] = 0;
				const tmp_path = path.filter(p => !p.equals(rand_surrounding)).map(p => Point.copy(p));

				if (this.is_connected(init_point, tmp_path, tmp_result)) {
					result[rand_surrounding.y][rand_surrounding.x] = false;
					path = path.filter(p => !p.equals(rand_surrounding));
					surrounding = path[i] == null ? null : this.get_surrounding_removable(init_point, result, point);
					if (surrounding == null) {
						break;
					}
				}
				else {
					surrounding = surrounding.filter(p => !p.equals(rand_surrounding));
					if (surrounding.length === 0) {
						break;
					}
					--j;
				}
			}
		}

		return ArrayUtil.trim(result);
	}

	public is_connected(current_point: Point, path: Array<Point>, bool_array: Array<Array<number>>): boolean {
		return path.length === ArrayUtil.find_nb_connected(current_point.y, current_point.x, bool_array);
	}

	public get_possible_directions(cur: Point, grid: Array<boolean[]>): Direction[] {
		const result = new Array<Direction>();
		if (cur.x > 0) {
			result.push(Direction.LEFT);
		}
		if (cur.x < grid[cur.y].length - 1) {
			result.push(Direction.RIGHT);
		}
		if (cur.y > 0) {
			result.push(Direction.UP);
		}
		if (cur.y < grid.length - 1) {
			result.push(Direction.DOWN);
		}
		return result;
	}

	public get_next_point(cur: Point, possible_directions: Direction[]): Point {
		let point: Point;
		switch (possible_directions[MathUtil.get_random_int(possible_directions.length)]) {
			case Direction.LEFT: point = new Point(cur.x - 1, cur.y); break;
			case Direction.RIGHT: point = new Point(cur.x + 1, cur.y); break;
			case Direction.DOWN: point = new Point(cur.x, cur.y + 1); break;
			case Direction.UP: point = new Point(cur.x, cur.y - 1); break;
		}
		return point;
	}

	// Pâté detector
	public get_surrounding(array: boolean[][], p: Point): Array<Point> {
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

	public get_surrounding_removable(current_point: Point, array: boolean[][], p: Point): Array<Point> {
		let surrounding = this.get_surrounding(array, p);
		if (surrounding.length < 6) {
			return null;
		}
		for (let j = 0; j < surrounding.length; j++) {
			if ((surrounding[j].equals(current_point))) {
				surrounding = PointUtil.remove_from_array(surrounding, new Point(surrounding[j].x, surrounding[j].y));
			}
		}
		return surrounding;
	}
}