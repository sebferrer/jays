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

	public angle(p: Point): number {
		const delta_y = this.y - p.y;
		const delta_x = p.x - this.x;
		return Math.atan2(delta_y, delta_x);
	}

	public translate(angle, distance): Point {
		let x = this.x;
		let y = this.y;
		x += distance * Math.sin(angle);
		y += distance * Math.cos(angle);
		return new Point(x, y);
	}

	public translateFromPoint(angle, distance, p): Point {
		let x = p.x;
		let y = p.y;
		x += distance * Math.sin(angle);
		y += distance * Math.cos(angle);
		return new Point(x, y);
	}
}