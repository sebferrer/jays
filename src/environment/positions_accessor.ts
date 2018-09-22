import { Point } from "../point";

export interface IPositionable {
	width: number;
	height: number;
	/** Top left */
	position: Point;
}

/** Used to easily retrieve the top corner points of a positionable object */
export class PositionAccessor {

	private _target: IPositionable;

	constructor(target: IPositionable) {
		if (target == null) {
			throw new Error("target cannot be null");
		}

		// IPositionable is an object, so passed by reference: even if its width/height/position change,
		// this helper will always return the right value (as long as the object's reference is still right)
		this._target = target;
	}

	public get top_left(): Point {
		return new Point(this._target.position.x, this._target.position.y);
	}

	public get top_right(): Point {
		return new Point(this._target.position.x + this._target.width, this._target.position.y);
	}

	public get bottom_left(): Point {
		return new Point(this._target.position.x, this._target.position.y + this._target.height);
	}

	public get bottom_right(): Point {
		return new Point(this._target.position.x + this._target.width, this._target.position.y + this._target.height);
	}
}