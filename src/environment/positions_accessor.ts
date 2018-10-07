import { Point } from "../point";

export interface IPositionable {
	width: number;
	height: number;
	/** Top left */
	position: Point;
}

/** Helper class used to easily retrieve the top corner points of a positionable object */
export class PositionAccessor {
	public static left_x(target: IPositionable): number { return target.position.x; }
	public static right_x(target: IPositionable): number { return target.position.x + target.width; }
	public static top_y(target: IPositionable): number { return target.position.y; }
	public static bottom_y(target: IPositionable): number { return target.position.y + target.height; }
	public static top_left(target: IPositionable): Point { return new Point(target.position.x, target.position.y); }
	public static top_right(target: IPositionable): Point { return new Point(target.position.x + target.width, target.position.y); }
	public static bottom_left(target: IPositionable): Point { return new Point(target.position.x, target.position.y + target.height); }
	public static bottom_right(target: IPositionable): Point { return new Point(target.position.x + target.width, target.position.y + target.height); }
}