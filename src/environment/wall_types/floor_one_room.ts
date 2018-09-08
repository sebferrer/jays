import { WallSprite } from "../wall_sprite";
import { Point } from "../../point";
import { RoomWalls } from "../room_walls";
import { Direction } from "../../enum";

export class FloorOneWalls extends RoomWalls {
	constructor(door_placement: Direction[]) {
		const corner_sprite = new WallSprite(new Point(0, 0), new Point(60, 60), "assets/img/walls/floor_one.png");
		const side_sprite = new WallSprite(new Point(60, 0), new Point(120, 60), "assets/img/walls/floor_one.png");
		const door_sprite = new WallSprite(new Point(120, 0), new Point(180, 60), "assets/img/walls/floor_one.png");

		super(corner_sprite, side_sprite, door_sprite, door_placement);
	}
}