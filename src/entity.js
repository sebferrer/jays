class Entity {
    constructor(width, height, pos_x, pos_y) {
        this.width = width;
        this.height = height;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.facing_direction;
        this.sprite_filename;
        this.speed;
    }

    next_position(direction) {
        let pos_y = this.pos_y;
        let pos_x = this.pos_x;
        switch(direction) {
            case Direction.UP: pos_y = this.pos_y - this.speed; break;
            case Direction.DOWN: pos_y = this.pos_y + this.speed; break;
            case Direction.LEFT: pos_x = this.pos_x - this.speed; break;
            case Direction.RIGHT: pos_x = this.pos_x + this.speed; break;
        }
        return { "pos_x": pos_x, "pos_y": pos_y };
    }

    move_direction(direction) {
        let next_position = this.next_position(direction);
        let collision = this.collision_map(direction, next_position);
        if(!collision.is_collision) {
            this.pos_x = next_position.pos_x;
            this.pos_y = next_position.pos_y;
        }
        else {
            if(collision.x != 0) { this.pos_x += collision.x };
            if(collision.y != 0) { this.pos_y += collision.y };
            this.has_collision_map();
        }
    }

    collision_map(direction, position) {
        for(let i = 0; i < gameState.current_map.height; i++) {
            for(let j = 0; j < gameState.current_map.width; j++) {
                let tile = gameState.current_map.tiles[i][j];
                if(tile.has_collision) {
                    let is_collision = Collision.is_collision(position.pos_x, position.pos_y, position.pos_x+this.width, position.pos_y+this.height,
                                                              tile.pos_x, tile.pos_y, tile.pos_x+tile.width, tile.pos_y+tile.height)
                    if(is_collision) {
                        switch(direction) {
                            case Direction.UP: return { "is_collision": true, "x": 0, "y": (tile.pos_y+tile.height-this.pos_y)}; break;
                            case Direction.DOWN: return { "is_collision": true, "x": 0, "y": (this.pos_y+this.height-tile.pos_y)*-1}; break;
                            case Direction.LEFT: return { "is_collision": true, "x": (tile.pos_x+tile.width-this.pos_x), "y": 0}; break;
                            case Direction.RIGHT: return { "is_collision": true, "x": (this.pos_x+this.width-tile.pos_x)*-1, "y": 0}; break;
                        }
                    }
                }
            }
        }
        return { "is_collision": false, "x": 0, "y": 0 };
    }

    has_collision_map() {}
}

class Jays extends Entity {
    constructor(width, height, pos_x, pos_y) {
        super(width, height, pos_x, pos_y);
        this.sprite_filename = "assets/img/jays.png";
        this.speed = 2;
        this.tear_delay = 250;
    }
}

class Enemy extends Entity {
    constructor(width, height) {
        super(width, height);
    }
}

class Blob extends Enemy {
    constructor(width, height) {
        super(width, height);
    }
}