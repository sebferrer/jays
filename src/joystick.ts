import { Point } from "./point";

export class Joystick {
	public zone: JoystickCircle;
	public controller: JoystickCircle;
	public coeff_x: number;
	public coeff_y: number;
	public div_zone: HTMLDivElement;
	public rect_zone: Rect;
	public div_controller: HTMLDivElement;
	public rect_controller: Rect;

	constructor(zonePos: Point, zoneRadius: number, controllerPos: Point, controllerRadius: number) {
		this.zone = new JoystickCircle(zonePos, zoneRadius, "rgba(18, 65, 145, 0.5)");
		this.controller = new JoystickCircle(controllerPos, controllerRadius, "rgba(18, 65, 145, 0.8)");
		this.rect_zone = new Rect();
		this.rect_controller = new Rect();
		this.createDivs();
	}

	public createDivs() {
		this.rect_zone.x = (this.zone.circle.pos.x-this.zone.circle.radius);
		this.rect_zone.y = (this.zone.circle.pos.y-this.zone.circle.radius);
		this.rect_zone.width = this.zone.circle.radius*2;
		this.rect_zone.height = this.zone.circle.radius*2;

		this.rect_controller.x = (this.controller.circle.pos.x-this.controller.circle.radius);
		this.rect_controller.y = (this.controller.circle.pos.y-this.controller.circle.radius);
		this.rect_controller.width = this.controller.circle.radius*2;
		this.rect_controller.height = this.controller.circle.radius*2;

		this.div_zone = document.createElement("div");
		this.div_zone.style.width = this.rect_zone.width+"px";
		this.div_zone.style.height = this.rect_zone.height+"px";
		this.div_zone.style.position = "absolute";
		this.div_zone.style.left = this.rect_zone.x+"px";
		this.div_zone.style.top = this.rect_zone.y+"px";
		this.div_zone.style.backgroundColor = this.zone.color;
		this.div_zone.style.borderRadius = "20em";

		this.div_controller = document.createElement("div");
		this.div_controller.style.width = this.rect_controller.width+"px";
		this.div_controller.style.height = this.rect_controller.height+"px";
		this.div_controller.style.position = "absolute";
		this.div_controller.style.left = this.rect_controller.x+"px";
		this.div_controller.style.top = this.rect_controller.y+"px";
		this.div_controller.style.backgroundColor = this.controller.color;
		this.div_controller.style.borderRadius = "20em";

		document.body.appendChild(this.div_zone);
		document.body.appendChild(this.div_controller);
	}

	public move(x: number, y: number): void {
		const next_circle = new Circle(new Point(x, y), this.controller.circle.radius);
		if (this.zone.circle.containsPoint(next_circle.pos)) {
			const angle = this.zone.circle.pos.angle(next_circle.pos) + (Math.PI / 2);
			next_circle.pos = next_circle.pos.translateFromPoint(angle, this.zone.circle.radius, this.zone.circle.pos);
		}

		this.coeff_x = (this.zone.circle.pos.x-next_circle.pos.x)*(-1) / this.zone.circle.radius;
		this.coeff_x = Math.round(this.coeff_x*100) / 100;
		this.coeff_y = (this.zone.circle.pos.y-next_circle.pos.y) / this.zone.circle.radius;
		this.coeff_y = Math.round(this.coeff_y*100) / 100;

		this.div_controller.style.left = (next_circle.pos.x-this.controller.circle.radius)+"px";
		this.div_controller.style.top = (next_circle.pos.y-this.controller.circle.radius)+"px";
	}
}

class JoystickCircle {
	public circle: Circle;
	public color: string;
	constructor(pos: Point, radius: number, color: string) {
		this.circle = new Circle(pos, radius);
		this.color = color;
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
	public x: number;
	public y: number;
	public width: number;
	public height: number;
	constructor(x?: number, y?: number, width?: number, height?: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}