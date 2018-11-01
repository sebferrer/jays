import { IMAGE_BANK } from "../main";
import { TileType } from "./../enum";
import { IDrawable } from "./../idrawable";
import { Point } from "./../point";
import { WarpInfo } from "./../warp_info";
import { IPositionable } from "./positions_accessor";

export class Tile implements IDrawable, IPositionable {

	public width: number;
	public height: number;
	public id: number;
	public desc: string;
	public src: Point;
	public coord_x: number;
	public coord_y: number;
	public position: Point;
	public has_collision: boolean;
	public warp_info: WarpInfo;
	public type: TileType;
	public anim: number[]; // IDs of the tiles dedicated to animation

	constructor(id: number, desc: string, src: Point, has_collision: boolean) {
		this.width = 20;
		this.height = 20;
		this.id = id;
		this.desc = desc;
		this.src = new Point(src.x, src.y);
		this.position = new Point();
		this.has_collision = has_collision;
		this.anim = new Array<number>(); // If primary, contains all the animated tiles IDs
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		//TODO: "assets/img/tiles.png" should be an attribute, so we can use whatever sprite sheet we want
		ctx.drawImage(IMAGE_BANK.pictures["assets/img/tiles.png"],
			this.src.x * this.height, this.src.y * this.width,
			this.width, this.height,
			this.position.x, this.position.y,
			this.width, this.height);
	}
}

export const TILE_REF = new Tile(0, "", new Point(-1, -1), false);

export const TILE_TYPES: { [key: number]: Tile } = {
	1: new Tile(1, "Earth", new Point(0, 0), false),
	2: new Tile(2, "Rock", new Point(1, 0), true),
	3: new Tile(3, "Water", new Point(2, 0), true),
	4: new Tile(4, "Grass", new Point(3, 0), false),
	5: new Tile(5, "Grass textured light", new Point(4, 0), false),
	9: new Tile(9, "Grass light", new Point(3, 1), false),
	10: new Tile(10, "Grass textured", new Point(4, 1), false),
	12: new Tile(12, "Iron", new Point(1, 2), true),
	13: new Tile(13, "better water", new Point(1, 1), true),

	// Rocky texture
	14: new Tile(14, "Rocky Top left", new Point(0, 4), false),
	15: new Tile(15, "Rocky Top", new Point(1, 4), false),
	16: new Tile(16, "Rocky Top right", new Point(2, 4), false),
	17: new Tile(17, "Rocky Left", new Point(0, 5), false),
	18: new Tile(18, "Rocky Center", new Point(1, 5), false),
	19: new Tile(19, "Rocky Right", new Point(2, 5), false),
	20: new Tile(20, "Rocky Bottom left", new Point(0, 6), false),
	21: new Tile(21, "Rocky Bottom", new Point(1, 6), false),
	22: new Tile(22, "Rocky Bottom right", new Point(2, 6), false),
};