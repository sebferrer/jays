import { Joystick } from "./joystick";

export class Joysticks {
	public _left: Joystick;
	public get left(): Joystick { return this._left; }
	public set left(left: Joystick) {
		if(this._left == null) {
			this._left = left;
		}
	}

	public _right: Joystick;
	public get right(): Joystick { return this._right; }
	public set right(right: Joystick) {
		if(this._right == null) {
			this._right = right;
		}
	}

	constructor() {
		this._left = null;
		this._right = null;
	}

	public remove(joystick: Joystick) {
		if(this._left === joystick) {
			delete this._left;
		}
		else {
			delete this._right;
		}
	}

	public is_empty(): boolean {
		return this._left == null && this._right == null;
	}
}