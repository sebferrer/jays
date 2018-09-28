import { WallElement } from "./wall_element";
import { Direction } from "../../enum";
import { WallSprite } from "./wall_sprite";
import { Point } from "../../point";

export class CustomWallElement extends WallElement {
	public get_position(direction: Direction, sprite: WallSprite): Point {
		throw new Error("CustomWallElements are not positioned with a direction, you must precise their position");
	}
}