import { Wall } from "../wall";
import { WallSprite } from "../wall_sprite";
import { Point } from "../../point";

export class FloorOneRoom extends Wall {
	constructor() {
		const corner_sprite = new WallSprite(new Point(0, 0), new Point(60, 60), "assets/img/walls/floor_one.png");
		const side_sprite = new WallSprite(new Point(60, 0), new Point(120, 60), "assets/img/walls/floor_one.png");

		super(corner_sprite, side_sprite);
	}
}