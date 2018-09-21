import { WallElement } from "./room_element";
import { Direction } from "../enum";
import { WallSprite } from "./wall_sprite";
import { Point } from "../point";
import { canvas_W, canvas_H } from "../main";

/** Represents a whole portion of a wall */
export class RoomSideWall extends WallElement {
	constructor(direction: Direction, sprite: WallSprite) {
		let dimensions: { width: number, height: number };
		switch (direction) {
			case Direction.UP:
			case Direction.DOWN:
				// the sides could be removed, but idgaf
				dimensions = { width: canvas_W, height: sprite.height };
				break;
			case Direction.LEFT:
			case Direction.RIGHT:
				dimensions = { width: sprite.width, height: canvas_H };
				break;
		}
		super(direction, sprite, null, dimensions.width, dimensions.height);
	}

	protected get_position(direction: Direction, sprite: WallSprite): Point {
		switch (direction) {
			case Direction.UP: return new Point(sprite.width, 0);
			case Direction.DOWN: return new Point(sprite.width, canvas_H - sprite.height);
			case Direction.LEFT: return new Point(0, sprite.height);
			case Direction.RIGHT: return new Point(canvas_W - sprite.width, sprite.height);
			default: throw new Error(`Unknown or invalid direction '${direction}'`);
		}
	}
}