class Entity {
    constructor(width, height, pos_x, pos_y) {
        this.width = width;
        this.height = height;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.facing_direction;
        this.sprite_filename;
    }
}

class Jays extends Entity {
    constructor(width, height) {
        super(width, height);
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