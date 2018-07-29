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
        this.pos_x = next_position.pos_x;
        this.pos_y = next_position.pos_y;
    }
}

class Jays extends Entity {
    constructor(width, height, pos_x, pos_y) {
        super(width, height, pos_x, pos_y);
        this.sprite_filename = "assets/img/jays.png";
        this.speed = 1;
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