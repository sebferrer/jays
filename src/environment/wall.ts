import { Point } from "../point";

export class WallSprite {

	protected _top_left: Point;
	public get top_left(): Point { return this._top_left; }

	protected _bottom_right: Point;
	public get bottom_right(): Point { return this._bottom_right; }

	protected _sprite_sheet_path: string;
	public get sprite_sheet_path(): string { return this._sprite_sheet_path; }

	public get width(): number { return this.bottom_right.x - this.top_left.x; }
	public get height(): number { return this.bottom_right.y - this.top_left.y; }

	constructor(top_left: Point, bottom_right: Point, sprite_sheet_path: string) {
		if (top_left == null) {
			throw new Error("Parameter 'top_left' cannot be null");
		}
		if (bottom_right == null) {
			throw new Error("Parameter 'bottom_right' cannot be null");
		}
		if (sprite_sheet_path == null) {
			throw new Error("Parameter 'sprite_sheet_path' cannot be null");
		}
		this._top_left = top_left;
		this._bottom_right = bottom_right;
		this._sprite_sheet_path = sprite_sheet_path;
	}

}

export abstract class Wall {
	protected _corner_sprite: WallSprite;
	public get corner_sprite(): WallSprite { return this._corner_sprite; }

	protected _side_sprite: WallSprite;
	public get side_sprite(): WallSprite { return this._side_sprite; }

	constructor(corner_sprite: WallSprite, side_sprite: WallSprite) {
		if (corner_sprite == null) {
			throw new Error("Parameter 'corner_sprite' cannot be null");
		}
		if (side_sprite == null) {
			throw new Error("Parameter 'side_sprite' cannot be null");
		}

		this._corner_sprite = corner_sprite;
		this._side_sprite = side_sprite;
	}
}

export class FloorOneRoom extends Wall {
	constructor() {
		const corner_sprite = new WallSprite(new Point(0, 0), new Point(60, 60), "assets/img/walls/floor_one.png");
		const side_sprite = new WallSprite(new Point(60, 0), new Point(120, 60), "assets/img/walls/floor_one.png");

		super(corner_sprite, side_sprite);
	}
}