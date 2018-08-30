import { ArrayUtil } from "./util";
import { gameState } from "./main";
import { Entity } from "./entity";
import { Direction } from "./enum";
import { Sprite } from "./sprite";
import { CollisionWarp } from "./collision_warp";

export abstract class Tear extends Entity {
	public direction: Direction;
	public init_pos_x: number;
	public init_pos_y: number;
	constructor(id: string, current_sprite: Sprite, pos_x: number, pos_y: number, width: number, height: number) {
		super(id, current_sprite, pos_x, pos_y, width, height);
		this.init_pos_x = pos_x;
		this.init_pos_y = pos_y;
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
		return Math.sqrt(Math.pow(this.init_pos_x - this.pos_x, 2) + Math.pow(this.init_pos_y - this.pos_y, 2)) >= gameState.jays.range * 20;
	}

	public on_out_of_range() {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}
}

export class TearBasic extends Tear {
	public speed: number;
	public range: number;
	constructor(pos_x: number, pos_y: number, direction: Direction, id?: string, current_sprite?: Sprite, width?: number, height?: number) {
		super("tear_basic", new Sprite(0, 0, 10, 10), pos_x, pos_y, 10, 10);
		this.pos_x -= this.width / 2;
		this.pos_y -= this.height / 2;
		this.direction = direction;
		this.sprite_filename = "assets/img/tear.png";
		this.speed = 3;
		this.range = 6;
	}

	public on_collision_map(): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}

	public on_collision_warp(collision_warp: CollisionWarp): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}
}