class GameState {
    constructor(map) {
        this.current_map = map;
        this.jays; 
        this.direction_event = new DirectionEvent();
        this.attack_direction_event;
    }

    key_down(keyName) {
        switch(keyName) {
            case 'z': this.direction_event.move_up = true; break;
            case 's': this.direction_event.move_down = true; break;
            case 'q': this.direction_event.move_left = true; break;
            case 'd': this.direction_event.move_right = true; break;
        }
    }

    key_up(keyName) {
        switch(keyName) {
            case 'z': this.direction_event.move_up = false; break;
            case 's': this.direction_event.move_down = false; break;
            case 'q': this.direction_event.move_left = false; break;
            case 'd': this.direction_event.move_right = false; break;
        }
    }

    update() {
        ctx.save();
        ctx.clearRect(0, 0, canvas_W, canvas_H);
        
        try {
            renderer.render_map(gameState.current_map);
        } catch (err) {}

        if (this.direction_event.move_up) { this.jays.move_direction(Direction.UP); }
        if (this.direction_event.move_down) { this.jays.move_direction(Direction.DOWN); }
        if (this.direction_event.move_left) { this.jays.move_direction(Direction.LEFT); }
        if (this.direction_event.move_right) { this.jays.move_direction(Direction.RIGHT); }

        try {
            renderer.render_jays();
        } catch (err) {}
        
        ctx.restore();
        
        var self = this;
        window.requestAnimationFrame(function() { self.update() });
    }
}

const Direction = Object.freeze({
    UP: Symbol("Up"),
    DOWN: Symbol("Down"),
    LEFT: Symbol("Left"),
    RIGHT: Symbol("Right")
});

class DirectionEvent {
    constructor() {
        this.move_up = false;
        this.move_down = false; 
        this.move_left = false;
        this.move_right = false;
    }
}