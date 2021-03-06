import { Direction } from "./enum";
import { ArrayUtil } from "./util";

export class AttackDirectionEvent {
	public directions: Direction[];

	constructor() {
		// To manage the multi-key press
		// Taking always the first Direction of this array,
		// even though the user presses many attack keys in same time
		// and then releases them, only the last pressed will be taken into account
		this.directions = new Array<Direction>();
	}

	public add(direction: Direction) {
		ArrayUtil.add_first_no_duplicate(this.directions, direction);
	}

	public remove(direction: Direction) {
		ArrayUtil.remove_from_array(this.directions, direction);
	}

	public clear() {
		this.directions = [];
	}
}