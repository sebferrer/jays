export class Point {
	public x: number;
	public y: number;

	constructor(x?: number, y?: number) {
		this.x = x == null ? 0 : x;
		this.y = y == null ? 0 : y;
	}

	public distanceBetween(p: Point): number {
		return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
	}

	public static copy(point: Point): Point {
		return point == null ? new Point() : new Point(point.x, point.y);
	}
}