import { ArrayUtil } from "./util";
import { gameState } from "./main";
import { Entity } from "./entity";

export class Tear extends Entity {
    public direction: any;
    constructor(width, height, pos_x, pos_y) {
        super(width, height, pos_x, pos_y);
    }
}

export class TearBasic extends Tear {
    public sprite_filename: any;
    public speed: any;
    constructor(width, height, pos_x, pos_y, direction) {
        super(width, height, pos_x, pos_y);
        this.direction = direction;
        this.sprite_filename = "assets/img/tear.png";
        this.speed = 3;
    }

    has_collision_map() {
        ArrayUtil.removeFromArray(gameState.tears, this);
    }

    has_collision_warp() {
        ArrayUtil.removeFromArray(gameState.tears, this);
    }
}

export const TEAR_BASIC = new TearBasic(10, 10, 0, 0, null);