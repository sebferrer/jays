import { ArrayUtil } from "./../util";
import { gameState, IMAGE_BANK } from "./../main";
import { Entity } from "./../entity";
import { Direction } from "./../enum";
import { Sprite } from "./../sprite";
import { Point } from "./../point";
import { IDrawable } from "../idrawable";

export abstract class Tear extends Entity implements IDrawable {
	public direction: Direction;
	public init_pos: Point;
	constructor(id: string, current_sprite: Sprite, pos: Point, width: number, height: number) {
		super(id, current_sprite, pos, width, height);
		this.init_pos = new Point(pos.x, pos.y);
	}

	public move(): void {
		if (this.out_of_range()) {
			this.on_out_of_range();
		} else {
			this.move_direction(this.direction);
		}
	}

	public out_of_range(): boolean {
		return this.init_pos.distanceBetween(this.position) >= gameState.jays.range * 20;
	}

	public on_out_of_range() {
		ArrayUtil.remove_from_array(gameState.tears, this);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.drawImage(IMAGE_BANK.pictures[this.sprite_filename],
			this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
			this.position.x, this.position.y, this.width, this.height);
	}
}

export class TearBasic extends Tear {
	public speed: number;
	public range: number;
	constructor(pos: Point, direction: Direction, id?: string, current_sprite?: Sprite, width?: number, height?: number) {
		super("tear_basic", new Sprite(0, 0, 10, 10), new Point(pos.x, pos.y), 10, 10);
		this.position.x -= this.width / 2;
		this.position.y -= this.height / 2;
		this.direction = direction;
		this.sprite_filename = "assets/img/tear.png";
		this.speed = 6;
	}

	public on_collision_map(): void {
		ArrayUtil.remove_from_array(gameState.tears, this);
	}
}