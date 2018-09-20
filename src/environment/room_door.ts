import { WallElement } from "./room_element";
import { Direction } from "../enum";
import { WallSprite } from "./wall_sprite";
import { Point } from "../point";
import { canvas_W, canvas_H } from "../main";

/** Represents a whole portion of a wall */
export class RoomDoor extends WallElement {
	constructor(direction: Direction, sprite: WallSprite) {
		super(direction, sprite);
	}

	public get_position(direction: Direction, sprite: WallSprite): Point {
		switch (direction) {
			case Direction.UP: return new Point(canvas_W / 2 - sprite.width / 2, 0);
			case Direction.DOWN: return new Point(canvas_W / 2 - sprite.width / 2, canvas_H - sprite.height);
			case Direction.LEFT: return new Point(0, canvas_H / 2 - sprite.height / 2);
			case Direction.RIGHT: return new Point(canvas_W - sprite.width, canvas_H / 2 - sprite.height / 2);
			default: throw new Error(`Unknown direction '${direction}'`);
		}
	}
}