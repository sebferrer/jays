import { ArrayUtil } from "./util";
import { gameState } from "./main";
import { Entity } from "./entity";
import { Direction } from "./enum";
import { Sprite } from "./sprite";
import { CollisionWarp } from "./collision_warp";

export class Tear extends Entity {
	public direction: Direction;
	constructor(id: string, current_sprite: Sprite, width: number, height: number, pos_x: number, pos_y: number) {
		super(id, current_sprite, width, height, pos_x, pos_y);
	}
}

export class TearBasic extends Tear {
	public speed: number;
	constructor(id: string, current_sprite: Sprite, width: number, height: number, pos_x: number, pos_y: number, direction: Direction) {
		super(id, current_sprite, width, height, pos_x, pos_y);
		this.direction = direction;
		this.sprite_filename = "assets/img/tear.png";
		this.speed = 3;
	}

	public has_collision_map(): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}

	public has_collision_warp(direction: Direction, collision_warp: CollisionWarp): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}
}

export const TEAR_BASIC = new TearBasic("tear_basic_ref", new Sprite(0, 0, 10, 10), 10, 10, 0, 0, null);