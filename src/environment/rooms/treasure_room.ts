import { RoomMap } from "./room_map";
import { Direction } from "../../enum";
import { RoomWalls } from "../walls/room_walls";
import { RoomCornerWall } from "../walls/corner_wall";
import { WallSprite } from "../walls/wall_sprite";
import { Point } from "../../point";
import { SideWall } from "../walls/side_wall";
import { Door } from "../walls/door";
import { canvas_W } from "../../main";
import { CustomWallElement } from "../walls/custom_wall_element";
import { IRawMap } from "../irawmap";
import { IMiniMapColorConfig } from "../iminimap_configuration";
import { ICustomRoom } from "../iicon_room";

export class TreasureRoom extends RoomMap implements ICustomRoom {

	public color_configuration: IMiniMapColorConfig;
	public icon: WallSprite;

	constructor(door_placement: Direction[]) {
		const raw_map = <IRawMap>{
			width: 27, height: 18, tiles:
				[
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
					5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
				]
		};

		const corner_sprite = new WallSprite(new Point(0, 0), new Point(60, 60), "assets/img/walls/floor_one.png");
		const side_sprite = new WallSprite(new Point(60, 0), new Point(120, 60), "assets/img/walls/floor_one.png");
		const open_door_sprite = new WallSprite(new Point(120, 0), new Point(180, 60), "assets/img/walls/floor_one.png");
		const closed_door_sprite = new WallSprite(new Point(240, 0), new Point(300, 60), "assets/img/walls/floor_one.png");
		const leaves = new WallSprite(new Point(180, 0), new Point(240, 60), "assets/img/walls/floor_one.png");
		const cracks = new WallSprite(new Point(300, 0), new Point(360, 60), "assets/img/walls/floor_one.png");


		const side_walls = [
			new SideWall(Direction.UP, side_sprite),
			new SideWall(Direction.DOWN, side_sprite),
			new SideWall(Direction.LEFT, side_sprite),
			new SideWall(Direction.RIGHT, side_sprite),
		];

		const corner_walls = [
			new RoomCornerWall(Direction.TOP_LEFT, corner_sprite),
			new RoomCornerWall(Direction.TOP_RIGHT, corner_sprite),
			new RoomCornerWall(Direction.BOTTOM_LEFT, corner_sprite),
			new RoomCornerWall(Direction.BOTTOM_RIGHT, corner_sprite),
		];

		const doors = door_placement.map(placement => new Door(placement, open_door_sprite, closed_door_sprite));

		const custom_elements = [
			new CustomWallElement(Direction.RIGHT, leaves, new Point(canvas_W - 60, 60 * 4)),
			new CustomWallElement(Direction.RIGHT, leaves, new Point(canvas_W - 60, 60 * 6)),
			new CustomWallElement(Direction.LEFT, cracks, new Point(0, 60))
		];

		super(raw_map, new RoomWalls(side_walls, corner_walls, doors, custom_elements));

		this.color_configuration = <IMiniMapColorConfig>{
			not_visited_border: "#feda00",
			visited_border: "#feda00",
			active_fill: "#feda00",
			active_border: "#ffffff"
		};

		this.icon = new WallSprite(new Point(22, 0), new Point(44, 22), "assets/img/minimap_icons.png");
	}

}