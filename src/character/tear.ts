import { ArrayUtil } from "./../util";
import { gameState, bank } from "./../main";
import { Entity } from "./../entity";
import { Direction } from "./../enum";
import { Sprite } from "./../sprite";
import { CollisionWarp } from "./../collision_warp";
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
		if (!this.out_of_range()) {
			this.move_direction(this.direction);
		}
		else {
			this.on_out_of_range();
		}
	}

	public out_of_range(): boolean {
		return this.init_pos.distanceBetween(this.pos) >= gameState.jays.range * 20;
	}

	public on_out_of_range() {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.drawImage(bank.pic[this.sprite_filename],
			this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
			this.pos.x, this.pos.y, this.width, this.height);
	}
}

export class TearBasic extends Tear {
	public speed: number;
	public range: number;
	constructor(pos: Point, direction: Direction, id?: string, current_sprite?: Sprite, width?: number, height?: number) {
		super("tear_basic", new Sprite(0, 0, 10, 10), new Point(pos.x, pos.y), 10, 10);
		this.pos.x -= this.width / 2;
		this.pos.y -= this.height / 2;
		this.direction = direction;
		this.sprite_filename = "assets/img/tear.png";
		this.speed = 3;
	}

	public on_collision_map(): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}

	public on_collision_warp(collision_warp: CollisionWarp): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}
}