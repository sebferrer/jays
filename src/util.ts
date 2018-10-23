import { Point } from "./point";

export class ArrayUtil {
	public static get_index<T>(array: Array<T>, obj: T): number {
		let index = -1;
		let i = 0;
		while (index === -1 && i < array.length) {
			if (array[i] === obj) {
				index = i;
			}
			i++;
		}
		return index;
	}

	public static remove_from_array<T>(array: Array<T>, obj: T): boolean {
		if (array.indexOf(obj) >= 0) {
			array.splice(this.get_index(array, obj), 1);
			return true;
		}
		return false;
	}

	public static add_first_no_duplicate<T>(array: Array<T>, obj: T): boolean {
		if (!(array.indexOf(obj) >= 0)) {
			array.unshift(obj);
			return true;
		}
		return false;
	}

	public static diff<T>(array1: Array<T>, array2: Array<T>): Array<T> {
		return array1.filter(item => array2.indexOf(item) < 0);
	}

	public static find_nb_connected(x: number, y: number, array: Array<Array<number>>): number {
		const canUp = (x - 1 >= 0);
		const canDown = (x + 1 < array.length);
		const canRight = (y + 1 < array[0].length);
		const canLeft = (y - 1 >= 0);

		const value = array[x][y];

		let up = 0;
		let down = 0;
		let right = 0;
		let left = 0;

		array[x][y] = 2;

		if (canUp && array[x - 1][y] === value) {
			up = this.find_nb_connected(x - 1, y, array);
		}
		if (canDown && array[x + 1][y] === value) {
			down = this.find_nb_connected(x + 1, y, array);
		}
		if (canLeft && array[x][y - 1] === value) {
			left = this.find_nb_connected(x, y - 1, array);
		}
		if (canRight && array[x][y + 1] === value) {
			right = this.find_nb_connected(x, y + 1, array);
		}

		return up + left + right + down + 1;
	}

	/** Trims a 2D array by removing all the falsy values on each side of the array */
	public static trim<T>(array: T[][]): T[][] {
		// TOP
		while (!array[0].find(cell => !!cell)) {
			array.splice(0, 1);
		}
		// BOTTOM
		while (!array[array.length - 1].find(cell => !!cell)) {
			array.splice(array.length - 1, 1);
		}
		// LEFT
		while (!array.find(line => !!line[0])) {
			for (let y = 0; y < array.length; ++y) {
				array[y].splice(0, 1);
			}
		}
		// RIGHT
		while (!array.find(line => !!line[line.length - 1])) {
			for (let y = 0; y < array.length; ++y) {
				array[y].splice(array[y].length - 1, 1);
			}
		}
		return array;
	}

	public remove_row<T>(array: T[][], row_index: number): T[][] {
		array.slice(row_index - 1, 1);
		return array;
	}
}

export class SetUtil {
	public static remove_from_array<T>(set: Set<T>, obj: T): boolean {
		if (set.has(obj)) {
			set.delete(obj);
			return true;
		}
		return false;
	}

	public static add_first_no_duplicate<T>(set: Set<T>, obj: T): boolean {
		if (!(set.has(obj))) {
			set.add(obj);
			return true;
		}
		return false;
	}

	public static is_superset(set: Set<{}>, subset: Set<{}>): boolean {
		for (const elem of subset) {
			if (!set.has(elem)) {
				return false;
			}
		}
		return true;
	}

	public static union(setA: Set<{}>, setB: Set<{}>): Set<{}> {
		const union = new Set(setA);
		for (const elem of setB) {
			union.add(elem);
		}
		return union;
	}

	public static intersection(setA: Set<{}>, setB: Set<{}>): Set<{}> {
		const intersection = new Set();
		for (const elem of setB) {
			if (setA.has(elem)) {
				intersection.add(elem);
			}
		}
		return intersection;
	}

	public static difference(setA: Set<{}>, setB: Set<{}>): Set<{}> {
		const difference = new Set(setA);
		for (const elem of setB) {
			difference.delete(elem);
		}
		return difference;
	}
}

export class MathUtil {
	public static approx_eq(v1: number, v2: number, epsilon: number): boolean {
		if (epsilon == null) {
			epsilon = 0.001;
		}
		return Math.abs(v1 - v2) < epsilon;
	}

	public static get_random_int(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}
}

export class PointUtil {
	public static remove_from_array(array: any, point: Point): any {
		return array.filter(p => !p.equals(point));
	}

	public static point_array_copy(array1: Array<Point>): Array<Point> {
		const array2 = new Array<Point>();
		for (let i = 0; i < array1.length; i++) {
			array2.push(array1[i]);
		}
		return array2;
	}
}