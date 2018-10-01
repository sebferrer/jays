import { Joystick } from "./joystick";

export class ArrayUtil {
	/**
	 * TODO: I'd like to type array as Array<any>, but I get the following error:
	 * Error TS2339: Property 'includes' does not exist on type 'any[]'.
	 */
	public static get_index(array: any, obj: any): number {
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

	public static remove_from_array(array: any, obj: any): boolean {
		if (array.includes(obj)) {
			array.splice(this.get_index(array, obj), 1);
			return true;
		}
		return false;
	}

	public static add_first_no_duplicate(array: any, obj: any): boolean {
		if (!array.includes(obj)) {
			array.unshift(obj);
			return true;
		}
		return false;
	}

	public static diff(array1: Array<any>, array2: Array<any>): Array<any> {
		return array1.filter(function(i) {return array2.indexOf(i) < 0;});
	}

	public static touchlist_to_array(touchlist: TouchList): Array<any> {
		const touches_array = new Array<any>();
		if(touchlist != null) {
			for (let i = 0; i < touchlist.length; i++) {
				touches_array.push(touchlist[i]);
			}
		}
		return touches_array;
	}

	public static touchlist_to_id_array(touchlist: TouchList): Array<number> {
		const touches_id_array = new Array<number>();
		if(touchlist != null) {
			for (let i = 0; i < touchlist.length; i++) {
				touches_id_array.push(touchlist[i].identifier);
			}
		}
		return touches_id_array;
	}

	public static get_touch_by_identifier(touchlist: TouchList, identifier: number): any {
		for(let i = 0; i < touchlist.length; i++) {
			if(touchlist[i].identifier === identifier) {
				return touchlist[i];
			}
		}
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