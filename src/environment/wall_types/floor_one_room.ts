import { WallSprite } from "../wall_sprite";
import { Point } from "../../point";
import { RoomWalls } from "../room_walls";
import { Direction } from "../../enum";
import { RoomDoor } from "../room_door";
import { RoomSideWall } from "../room_side_wall";
import { RoomCornerWall } from "../room_corner_wall";

export class FloorOneWalls extends RoomWalls {
	constructor(door_placement: Direction[]) {
		const corner_sprite = new WallSprite(new Point(0, 0), new Point(60, 60), "assets/img/walls/floor_one.png");
		const side_sprite = new WallSprite(new Point(60, 0), new Point(120, 60), "assets/img/walls/floor_one.png");
		const door_sprite = new WallSprite(new Point(120, 0), new Point(180, 60), "assets/img/walls/floor_one.png");

		const side_walls = [
			new RoomSideWall(Direction.UP, side_sprite),
			new RoomSideWall(Direction.DOWN, side_sprite),
			new RoomSideWall(Direction.LEFT, side_sprite),
			new RoomSideWall(Direction.RIGHT, side_sprite),
		];

		const corner_walls = [
			new RoomCornerWall(Direction.TOP_LEFT, corner_sprite),
			new RoomCornerWall(Direction.TOP_RIGHT, corner_sprite),
			new RoomCornerWall(Direction.BOTTOM_LEFT, corner_sprite),
			new RoomCornerWall(Direction.BOTTOM_RIGHT, corner_sprite),
		];

		const doors = door_placement.map(placement => new RoomDoor(placement, door_sprite));

		super(side_walls, corner_walls, doors);
	}
}