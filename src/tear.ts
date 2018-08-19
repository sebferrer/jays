import { ArrayUtil } from "./util";
import { gameState } from "./main";
import { Entity } from "./entity";
import { Direction } from "./enum";
import { Sprite } from "./sprite";
import { CollisionWarp } from "./collision_warp";

export abstract class Tear extends Entity {
	public direction: Direction;
	constructor(id: string, current_sprite: Sprite, pos_x: number, pos_y: number, width: number, height: number) {
		super(id, current_sprite, width, height, pos_x, pos_y);
	}

	public move(): void { 
		this.move_direction(this.direction);
	}
}

export class TearBasic extends Tear {
	public speed: number;
	constructor(pos_x: number, pos_y: number, direction: Direction, id?: string, current_sprite?: Sprite, width?: number, height?: number) {
		// TODO: something is not right here
		super("tear_basic", new Sprite(0, 0, 10, 10), 10, 10, pos_x, pos_y);
		this.pos_x -= this.width/2;
		this.pos_y -= this.height/2;
		this.direction = direction;
		this.sprite_filename = "assets/img/tear.png";
		this.speed = 3;
	}

	public on_collision_map(): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}

	public on_collision_warp(direction: Direction, collision_warp: CollisionWarp): void {
		ArrayUtil.removeFromArray(gameState.tears, this);
	}
}