import { Direction } from "../../enum";
import { Point } from "../../point";
import { canvas_W, canvas_H } from "../../main";
import { WallSprite } from "./wall_sprite";
import { WallElement } from "./wall_element";
import { Rectangle } from "../../collision";

/** Represents a whole portion of a wall */
export class Door extends WallElement {

	protected _is_open: boolean;
	public get is_open(): boolean { return this._is_open; }
	public set is_open(value: boolean) {
		this._is_open = value;
		this._sprite = value ? this._open_sprite : this._closed_sprite;
		this._exit_rectangle = null;
	}

	protected _exit_rectangle: Rectangle;

	protected _open_sprite: WallSprite;
	protected _closed_sprite: WallSprite;

	constructor(direction: Direction, open_sprite: WallSprite, closed_sprite: WallSprite, is_open: boolean = true) {
		if (open_sprite == null) {
			throw new Error("Parameter 'open_sprite' cannot be null");
		}
		if (closed_sprite == null) {
			throw new Error("Parameter 'closed_sprite' cannot be null");
		}

		super(direction, open_sprite);
		this._open_sprite = open_sprite;
		this._closed_sprite = closed_sprite;
		this.is_open = is_open;
	}

	public get_position(direction: Direction, sprite: WallSprite): Point {
		switch (direction) {
			case Direction.UP: return new Point(canvas_W / 2 - sprite.width / 2, 0);
			case Direction.DOWN: return new Point(canvas_W / 2 - sprite.width / 2, canvas_H - sprite.height);
			case Direction.LEFT: return new Point(0, canvas_H / 2 - sprite.height / 2);
			case Direction.RIGHT: return new Point(canvas_W - sprite.width, canvas_H / 2 - sprite.height / 2);
			default: throw new Error(`Unknown or invalid direction '${direction}'`);
		}
	}

	public get_exit_rectangle(): Rectangle {
		if (!this.is_open) {
			return null;
		} else if (this._exit_rectangle != null) {
			return this._exit_rectangle;
		}
		console.log("doors: computing collisions...");
		switch (this.direction) {
			case Direction.UP:
				this._exit_rectangle = new Rectangle(this._positions_accessor.top_left, this._positions_accessor.top_right);
				break;
			case Direction.DOWN:
				this._exit_rectangle = new Rectangle(this._positions_accessor.bottom_left, this._positions_accessor.bottom_right);
				break;
			case Direction.LEFT:
				this._exit_rectangle = new Rectangle(this._positions_accessor.top_left, this._positions_accessor.bottom_left);
				break;
			case Direction.RIGHT:
				this._exit_rectangle = new Rectangle(this._positions_accessor.top_right, this._positions_accessor.bottom_right);
				break;
			default:
				throw new Error(`Unknown or invalid direction '${this.direction}'`);
		}
		return this._exit_rectangle;
	}
}