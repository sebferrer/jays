export class ArrayUtil {

	/**
	 * TODO: I'd like to type array as Array<any>, but I get the following error:
	 * Error TS2339: Property 'includes' does not exist on type 'any[]'.
	 */
	public static getIndex(array: any, obj: any): number {
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

	public static removeFromArray(array: any, obj: any): boolean {
		if (array.includes(obj)) {
			array.splice(this.getIndex(array, obj), 1);
			return true;
		}
		return false;
	}

	public static addFirstNoDuplicate(array: any, obj: any): boolean {
		if (!array.includes(obj)) {
			array.unshift(obj);
			return true;
		}
		return false;
	}
}