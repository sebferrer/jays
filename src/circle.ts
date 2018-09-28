import { Point } from "./point";

export class Circle {
	public pos: Point;
	public radius: number;
	constructor(pos?: Point, radius?: number) {
		this.pos = pos == null ? new Point() : new Point(pos.x, pos.y);
		this.radius = radius == null ? 0 : radius;
	}

	public inside(circle: Circle): boolean {
		return circle.radius > this.pos.distanceBetween(circle.pos) + this.radius;
	}

	public containsPoint(p: Point): boolean {
		return this.radius < this.pos.distanceBetween(p);
	}
}