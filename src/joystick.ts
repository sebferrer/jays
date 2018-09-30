import { Point } from "./point";
import { Circle } from "./circle";
import { Rect } from "./rect";

export class Joystick {
	public id: string;
	public zone: JoystickCircle;
	public controller: JoystickCircle;
	public coeff_x: number;
	public coeff_y: number;
	public div_zone: HTMLDivElement;
	public rect_zone: Rect;
	public center: Point;
	public div_controller: HTMLDivElement;
	public rect_controller: Rect;
	public next_circle: Circle;
	public force: Point;
	public touch_identifier: number;

	constructor(id: string, zonePos: Point, zoneRadius: number, controllerPos: Point, controllerRadius: number, touch_identifier: number) {
		this.id = id;
		this.zone = new JoystickCircle(zonePos, zoneRadius, "rgba(18, 65, 145, 0.5)");
		this.controller = new JoystickCircle(controllerPos, controllerRadius, "rgba(18, 65, 145, 0.8)");
		this.rect_zone = new Rect();
		this.rect_controller = new Rect();
		this.next_circle = new Circle();
		this.createDivs();
		this.center = new Point((this.rect_zone.x+(this.rect_zone.x+this.rect_zone.width))/2,
								(this.rect_zone.y+(this.rect_zone.y+this.rect_zone.height))/2);
		this.force = new Point();
		this.touch_identifier = touch_identifier;
	}

	public createDivs() {
		this.rect_zone.x = (this.zone.circle.pos.x - this.zone.circle.radius);
		this.rect_zone.y = (this.zone.circle.pos.y - this.zone.circle.radius);
		this.rect_zone.width = this.zone.circle.radius * 2;
		this.rect_zone.height = this.zone.circle.radius * 2;

		this.rect_controller.x = (this.controller.circle.pos.x - this.controller.circle.radius);
		this.rect_controller.y = (this.controller.circle.pos.y - this.controller.circle.radius);
		this.rect_controller.width = this.controller.circle.radius * 2;
		this.rect_controller.height = this.controller.circle.radius * 2;

		this.div_zone = this.zone.createDiv(this.rect_zone, this.zone.color);
		this.div_controller = this.zone.createDiv(this.rect_controller, this.controller.color);

		document.body.appendChild(this.div_zone);
		document.body.appendChild(this.div_controller);
	}

	public move(x: number, y: number): void {
		this.next_circle.pos.x = x;
		this.next_circle.pos.y = y;
		this.force.x = x - this.center.x;
		this.force.y = y - this.center.y;
		this.next_circle.radius = this.controller.circle.radius;
		if (this.zone.circle.containsPoint(this.next_circle.pos)) {
			const angle = this.zone.circle.pos.angle(this.next_circle.pos) + (Math.PI / 2);
			this.next_circle.pos = this.next_circle.pos.translateFromPoint(angle, this.zone.circle.radius, this.zone.circle.pos);
		}

		this.coeff_x = (this.zone.circle.pos.x - this.next_circle.pos.x) * (-1) / this.zone.circle.radius;
		this.coeff_x = Math.round(this.coeff_x * 100) / 100;
		this.coeff_y = (this.zone.circle.pos.y - this.next_circle.pos.y) / this.zone.circle.radius;
		this.coeff_y = Math.round(this.coeff_y * 100) / 100;

		this.div_controller.style.left = (this.next_circle.pos.x - this.controller.circle.radius) + "px";
		this.div_controller.style.top = (this.next_circle.pos.y - this.controller.circle.radius) + "px";
	}
}

class JoystickCircle {
	public circle: Circle;
	public color: string;
	constructor(pos: Point, radius: number, color: string) {
		this.circle = new Circle(pos, radius);
		this.color = color;
	}

	public createDiv(rect: Rect, color: string) {
		const div = document.createElement("div");
		div.style.width = rect.width + "px";
		div.style.height = rect.height + "px";
		div.style.position = "absolute";
		div.style.left = rect.x + "px";
		div.style.top = rect.y + "px";
		div.style.backgroundColor = color;
		div.style.borderRadius = "20em";
		if(!div.classList.contains("no-pointer-events")) {
			div.classList.add("no-pointer-events");
		}
		return div;
	}
}