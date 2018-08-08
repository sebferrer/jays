import { ArrayUtil } from "./util";
import { Direction } from "./enum";

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
		ArrayUtil.addFirstNoDuplicate(this.directions, direction);
	}

	public remove(direction: Direction) {
		ArrayUtil.removeFromArray(this.directions, direction);
	}
}