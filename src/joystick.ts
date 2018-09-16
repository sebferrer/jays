import { Point } from "./point";

export class Joystick {
	public zone: JoystickCircle;
	public controller: JoystickCircle;
	public coeff_x: number;
	public coeff_y: number;
	public canvas: HTMLCanvasElement;
	public ctx: CanvasRenderingContext2D;
	public canvas_rect = new Rect();

	constructor(zonePos: Point, zoneRadius: number, controllerPos: Point, controllerRadius: number) {
		this.zone = new JoystickCircle(zonePos, zoneRadius, "rgba(18, 65, 145, 0.5)");
		this.controller = new JoystickCircle(controllerPos, controllerRadius, "rgba(18, 65, 145, 0.8)");
		this.createCanvas();
		this.zone.circle.pos.x = this.zone.circle.radius+this.controller.circle.radius;
		this.zone.circle.pos.y = this.zone.circle.radius+this.controller.circle.radius;
		this.controller.circle.pos.x = this.zone.circle.radius+this.controller.circle.radius;
		this.controller.circle.pos.y = this.zone.circle.radius+this.controller.circle.radius;
		this.draw();
	}

	public createCanvas() {
		this.canvas_rect.left = (this.zone.circle.pos.x-this.zone.circle.radius);
		this.canvas_rect.top = (this.zone.circle.pos.y-this.zone.circle.radius);
		this.canvas_rect.width = this.zone.circle.radius*2+this.controller.circle.radius*2;
		this.canvas_rect.height = this.zone.circle.radius*2+this.controller.circle.radius*2;

		this.canvas = document.createElement("canvas");
		this.canvas.width = this.canvas_rect.width;
		this.canvas.height = this.canvas_rect.height;
		this.canvas.style.position = "absolute";
		this.canvas.style.left = this.canvas_rect.left+"px";
		this.canvas.style.top = this.canvas_rect.top+"px";
		this.canvas.style.backgroundColor = "transparent";
		document.body.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");
	}

	public draw(): void {
		this.ctx.save();
		this.ctx.clearRect(0, 0, this.canvas_rect.width, this.canvas_rect.height);

		this.zone.draw(this.ctx);
		this.controller.draw(this.ctx);

		this.ctx.restore();
	}

	public move(x: number, y: number): void {
		x -= this.canvas_rect.left;
		y -= this.canvas_rect.top;
		const next_circle = new Circle(new Point(x, y), this.controller.circle.radius);
		if (this.zone.circle.containsPoint(next_circle.pos)) {
			const angle = this.zone.circle.pos.angle(next_circle.pos) + (Math.PI / 2);
			next_circle.pos = new Point(next_circle.pos.translateFromPoint(angle, this.zone.circle.radius, this.zone.circle.pos).x,
			next_circle.pos.translateFromPoint(angle, this.zone.circle.radius, this.zone.circle.pos).y);
		}
		this.controller.circle.pos = new Point(next_circle.pos.x, next_circle.pos.y);
		this.coeff_x = (this.zone.circle.pos.x-next_circle.pos.x)*(-1) / this.zone.circle.radius;
		this.coeff_x = Math.round(this.coeff_x*100) / 100;
		this.coeff_y = (this.zone.circle.pos.y-next_circle.pos.y) / this.zone.circle.radius;
		this.coeff_y = Math.round(this.coeff_y*100) / 100;
	}

}

class JoystickCircle {
	public circle: Circle;
	public color: string;
	constructor(pos: Point, radius: number, color: string) {
		this.circle = new Circle(pos, radius);
		this.color = color;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.beginPath();
		ctx.arc(this.circle.pos.x, this.circle.pos.y, this.circle.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}

export class Circle {
	public pos: Point;
	public radius: number;
	constructor(pos: Point, radius: number) {
		this.pos = new Point(pos.x, pos.y);
		this.radius = radius;
	}

	public inside(circle: Circle): boolean {
		return circle.radius > this.pos.distanceBetween(circle.pos) + this.radius;
	}

	public containsPoint(p: Point): boolean {
		return this.radius < this.pos.distanceBetween(p);
	}
}

class Rect {
	public left: number;
	public top: number;
	public width: number;
	public height: number;
	constructor(left?: number, top?: number, width?: number, height?: number) {
		this.left = left;
		this.top = top;
		this.width = width;
		this.height = height;
	}
}