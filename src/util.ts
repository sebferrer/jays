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

	public static isSuperset(set, subset) {
		for (const elem of subset) {
			if (!set.has(elem)) {
				return false;
			}
		}
		return true;
	}
	
	public static union(setA, setB) {
		const union = new Set(setA);
		for (const elem of setB) {
			union.add(elem);
		}
		return union;
	}
	
	public static intersection(setA, setB) {
		const intersection = new Set();
		for (const elem of setB) {
			if (setA.has(elem)) {
				intersection.add(elem);
			}
		}
		return intersection;
	}
	
	public static difference(setA, setB) {
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
}