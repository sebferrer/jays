class GameState {
    constructor(map) {
        this.current_map = map;
        this.jays; 
        this.direction_event = new DirectionEvent();
        this.attack_direction_event = new AttackDirectionEvent();;
        this.timers = Array();
        this.tears = Array();
    }

    key_down(keyName) {
        switch(keyName) {
            case 'z': this.direction_event.move_up = true; break;
            case 's': this.direction_event.move_down = true; break;
            case 'q': this.direction_event.move_left = true; break;
            case 'd': this.direction_event.move_right = true; break;
            
            case 'ArrowUp':
                this.attack_direction_event.last_direction = this.attack_direction_event.direction;
                this.attack_direction_event.direction = Direction.UP;
                break;
            case 'ArrowDown':
                this.attack_direction_event.last_direction = this.attack_direction_event.direction;
                this.attack_direction_event.direction = Direction.DOWN;
                break;
            case 'ArrowLeft':
                this.attack_direction_event.last_direction = this.attack_direction_event.direction;
                this.attack_direction_event.direction = Direction.LEFT;
                break;
            case 'ArrowRight':
                this.attack_direction_event.last_direction = this.attack_direction_event.direction;
                this.attack_direction_event.direction = Direction.RIGHT;
                break;
        }
    }

    key_up(keyName) {
        switch(keyName) {
            case 'z': this.direction_event.move_up = false; break;
            case 's': this.direction_event.move_down = false; break;
            case 'q': this.direction_event.move_left = false; break;
            case 'd': this.direction_event.move_right = false; break;

            case 'ArrowUp': this.attack_direction_event.direction = null; break;
            case 'ArrowDown': this.attack_direction_event.direction = null; break;
            case 'ArrowLeft': this.attack_direction_event.direction = null; break;
            case 'ArrowRight': this.attack_direction_event.direction = null; break;
        }
    }

    update() {
        ctx.save();
        ctx.clearRect(0, 0, canvas_W, canvas_H);

        gameState.timers.forEach(function(timer) {
            timer.run();
        });
        //console.log(gameState.get_timer('test').tick);
        
        try {
            renderer.render_map(gameState.current_map);
        } catch (err) {}

        gameState.tears.forEach(function(tear) {
            renderer.render_tear(tear);
        });

        if (this.direction_event.move_up) { this.jays.move_direction(Direction.UP); }
        if (this.direction_event.move_down) { this.jays.move_direction(Direction.DOWN); }
        if (this.direction_event.move_left) { this.jays.move_direction(Direction.LEFT); }
        if (this.direction_event.move_right) { this.jays.move_direction(Direction.RIGHT); }

        /**** TEARS ****/
        let timer_tear = gameState.get_timer('tear');
        if([Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT].indexOf(this.attack_direction_event.direction) >= 0) {
            timer_tear.enable();
            if(timer_tear.next_tick()) {
                gameState.tears.push(new TearBasic(10, 10, gameState.jays.pos_x+gameState.jays.width/2,  gameState.jays.pos_y+gameState.jays.height/2, this.attack_direction_event.direction));
            }
        }
        else {
            timer_tear.reset();
        }

        gameState.tears.forEach(function(tear) {
            switch(tear.direction) {
                case Direction.UP: tear.move_direction(Direction.UP); break;
                case Direction.DOWN: tear.move_direction(Direction.DOWN); break;
                case Direction.LEFT: tear.move_direction(Direction.LEFT); break;
                case Direction.RIGHT: tear.move_direction(Direction.RIGHT); break;
            }
        });
        /***************/

        try {
            renderer.render_jays();
        } catch (err) {}

        ctx.restore();
        
        var self = this;
        window.requestAnimationFrame(function() { self.update() });
    }

    get_timer(id) {
        return gameState.timers.find(item => item.id === id);
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

class AttackDirectionEvent {
    constructor(direction) {
        this.direction = direction;
        this.up_pressed = false;
        this.down_pressed = false; 
        this.left_pressed = false;
        this.right_pressed = false;
    }
}