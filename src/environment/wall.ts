import { Point } from "../point";
import { WallSprite } from "./wall_sprite";

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