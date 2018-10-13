import { Joystick } from "./joystick";

export class Joysticks {
	public _left: Joystick;
	public _right: Joystick;

	constructor() {
		this._left = null;
		this._right = null;
	}

	public get left() {
		return this._left;
	}

	public get right() {
		return this._right;
	}

	public set left(left: Joystick) {
		if(this._left == null) {
			this._left = left;
		}
	}

	public set right(right: Joystick) {
		if(this._right == null) {
			this._right = right;
		}
	}

	public remove(joystick: Joystick) {
		if(this._left === joystick) {
			delete this._left;
		}
		else {
			delete this._right;
		}
	}

	public is_empty() {
		return this._left == null && this._right == null;
	}
}