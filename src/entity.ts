import { Collision } from "./collision";
import { gameState, canvas_H, canvas_W } from "./main";
import { Direction } from "./gamestate";
import { TILE_REF, Map } from "./map";

export class Entity {

    public facing_direction: any;
    public sprite_filename: any;
    public speed: any;

    constructor(
        public width,
        public height,
        public pos_x,
        public pos_y
    ) {
        this.facing_direction;
        this.sprite_filename;
        this.speed;
    }

    next_position(direction) {
        let pos_y = this.pos_y;
        let pos_x = this.pos_x;
        switch (direction) {
            case Direction.UP: pos_y = this.pos_y - this.speed; break;
            case Direction.DOWN: pos_y = this.pos_y + this.speed; break;
            case Direction.LEFT: pos_x = this.pos_x - this.speed; break;
            case Direction.RIGHT: pos_x = this.pos_x + this.speed; break;
        }
        return { "pos_x": pos_x, "pos_y": pos_y };
    }

    move_direction(direction) {
        let next_position = this.next_position(direction);
        let collision_map = this.collision_map(direction, next_position);
        if (!collision_map.is_collision) {
            this.pos_x = next_position.pos_x;
            this.pos_y = next_position.pos_y;
        }
        else {
            if (collision_map.x != 0) { this.pos_x += collision_map.x };
            if (collision_map.y != 0) { this.pos_y += collision_map.y };
            this.has_collision_map();
        }
        let collision_warp = this.collision_warp(next_position);
        if (collision_warp.is_collision) {
            this.has_collision_warp();
        }
    }

    collision_map(direction, position) {
        for (let i = 0; i < gameState.current_map.height; i++) {
            for (let j = 0; j < gameState.current_map.width; j++) {
                let tile = gameState.current_map.tiles[i][j];
                if (tile.has_collision) {
                    let is_collision = Collision.is_collision_nextpos_entity_tile(position, this, tile);
                    if (is_collision) {
                        switch (direction) {
                            case Direction.UP: return { "is_collision": true, "x": 0, "y": (tile.pos_y + tile.height - this.pos_y) }; break;
                            case Direction.DOWN: return { "is_collision": true, "x": 0, "y": (this.pos_y + this.height - tile.pos_y) * -1 }; break;
                            case Direction.LEFT: return { "is_collision": true, "x": (tile.pos_x + tile.width - this.pos_x), "y": 0 }; break;
                            case Direction.RIGHT: return { "is_collision": true, "x": (this.pos_x + this.width - tile.pos_x) * -1, "y": 0 }; break;
                        }
                    }
                }
            }
        }
        return { "is_collision": false, "x": 0, "y": 0 };
    }

    collision_warp(next_position?: any) {
        for (let i = 0; i < gameState.current_map.height; i++) {
            for (let j = 0; j < gameState.current_map.width; j++) {
                let tile = gameState.current_map.tiles[i][j];
                let is_warp = tile.is_warp(0);
                if (is_warp.bool) {
                    let is_collision = Collision.is_collision_entity_tile(this, tile);
                    if (is_collision) {
                        return { "is_collision": true, "is_warp": is_warp.bool, "destination": is_warp.destination };
                    }
                }
            }
        }
        return { "is_collision": false, "is_warp": false, "destination": -1 };
    }

    has_collision_map() { }

    has_collision_warp() { }
}

export class Jays extends Entity {

    public tear_delay: any;

    constructor(
        width,
        height,
        pos_x,
        pos_y
    ) {
        super(width, height, pos_x, pos_y);
        this.sprite_filename = "assets/img/jays.png";
        this.speed = 2;
        this.tear_delay = 250;
    }

    move_direction(direction) {
        super.move_direction(direction);
        let next_position = super.next_position(direction);
        let collision_warp = this.collision_warp();
        if (collision_warp.is_collision) {
            gameState.current_map = new Map(collision_warp.destination);
            // To change after warps improvement, see warp.js
            switch (direction) {
                case Direction.UP: this.pos_y = canvas_H - this.height - TILE_REF.height; break;
                case Direction.DOWN: this.pos_y = 0 + TILE_REF.height; break;
                case Direction.LEFT: this.pos_x = canvas_W - this.width - TILE_REF.height; break;
                case Direction.RIGHT: this.pos_x = 0 + TILE_REF.width; break;
            }
            gameState.tears = Array();
        }
    }
}

export class Enemy extends Entity {
    constructor(width, height) {
        super(width, height, undefined, undefined);
    }
}

export class BlobMob extends Enemy {
    constructor(width, height) {
        super(width, height);
    }
}