import { ArrayUtil } from "./util";
import { gameState } from "./main";
import { Entity } from "./entity";
import { Direction } from "./enum";

export class Tear extends Entity {
    public direction: Direction;
    constructor(width: number, height: number, pos_x: number, pos_y: number) {
        super(width, height, pos_x, pos_y);
    }
}

export class TearBasic extends Tear {
    public sprite_filename: string;
    public speed: number;
    constructor(width: number, height: number, pos_x: number, pos_y: number, direction: Direction) {
        super(width, height, pos_x, pos_y);
        this.direction = direction;
        this.sprite_filename = "assets/img/tear.png";
        this.speed = 3;
    }

    public has_collision_map(): void {
        ArrayUtil.removeFromArray(gameState.tears, this);
    }

    public has_collision_warp(): void {
        ArrayUtil.removeFromArray(gameState.tears, this);
    }
}

export const TEAR_BASIC = new TearBasic(10, 10, 0, 0, null);