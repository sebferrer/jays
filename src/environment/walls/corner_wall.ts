import { Direction } from "../../enum";
import { Point } from "../../point";
import { canvas_H, canvas_W } from "../../main";
import { WallSprite } from "./wall_sprite";
import { WallElement } from "./wall_element";

export class RoomCornerWall extends WallElement {

	constructor(direction: Direction, sprite: WallSprite) {
		super(direction, sprite);
	}

	protected get_position(direction: Direction, sprite: WallSprite): Point {
		switch (direction) {
			case Direction.TOP_LEFT: return new Point(0, 0);
			case Direction.TOP_RIGHT: return new Point(canvas_W - sprite.width, 0);
			case Direction.BOTTOM_LEFT: return new Point(0, canvas_H - sprite.height);
			case Direction.BOTTOM_RIGHT: return new Point(canvas_W - sprite.width, canvas_H - sprite.height);
			default: throw new Error(`Unknown or invalid direction '${direction}'`);
		}
	}
}