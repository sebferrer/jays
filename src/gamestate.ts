class GameState {

    public current_map: any;
    public jays: any;
    public direction_event: any;
    public attack_direction_event: any;
    public timers: any;
    public tears: any;

    constructor(map) {
        this.current_map = map;
        this.direction_event = new DirectionEvent();
        this.attack_direction_event = new AttackDirectionEvent();
        this.timers = Array();
        this.tears = Array();
    }

    key_down(keyName) {
        switch (keyName) {
            case 'z': this.direction_event.move_up = true; break;
            case 's': this.direction_event.move_down = true; break;
            case 'q': this.direction_event.move_left = true; break;
            case 'd': this.direction_event.move_right = true; break;

            case 'ArrowUp': this.attack_direction_event.add(Direction.UP); break;
            case 'ArrowDown': this.attack_direction_event.add(Direction.DOWN); break;
            case 'ArrowLeft': this.attack_direction_event.add(Direction.LEFT); break;
            case 'ArrowRight': this.attack_direction_event.add(Direction.RIGHT); break;
        }
    }

    key_up(keyName) {
        switch (keyName) {
            case 'z': this.direction_event.move_up = false; break;
            case 's': this.direction_event.move_down = false; break;
            case 'q': this.direction_event.move_left = false; break;
            case 'd': this.direction_event.move_right = false; break;

            case 'ArrowUp': this.attack_direction_event.remove(Direction.UP); break;
            case 'ArrowDown': this.attack_direction_event.remove(Direction.DOWN); break;
            case 'ArrowLeft': this.attack_direction_event.remove(Direction.LEFT); break;
            case 'ArrowRight': this.attack_direction_event.remove(Direction.RIGHT); break;
        }
    }

    update() {
        ctx.save();
        ctx.clearRect(0, 0, canvas_W, canvas_H);

        gameState.timers.forEach(function (timer) {
            timer.run();
        });
        //console.log(gameState.get_timer('test').tick); // 1 tick every second

        try {
            renderer.render_map(gameState.current_map);
        } catch (err) { }

        gameState.tears.forEach(function (tear) {
            renderer.render_tear(tear);
        });

        this.jays_update();
        this.tears_update();

        try {
            renderer.render_jays();
        } catch (err) { }

        ctx.restore();

        var self = this;
        window.requestAnimationFrame(function () { self.update() });
    }

    jays_update() {
        if (this.direction_event.move_up) { this.jays.move_direction(Direction.UP); }
        if (this.direction_event.move_down) { this.jays.move_direction(Direction.DOWN); }
        if (this.direction_event.move_left) { this.jays.move_direction(Direction.LEFT); }
        if (this.direction_event.move_right) { this.jays.move_direction(Direction.RIGHT); }
    }

    tears_update() {
        let timer_tear = gameState.get_timer('tear');
        if (this.attack_direction_event.directions.length > 0) {
            timer_tear.enable();
            if (timer_tear.next_tick()) {
                gameState.tears.push(new TearBasic(TEAR_BASIC.width, TEAR_BASIC.height,
                    gameState.jays.pos_x + gameState.jays.width / 2, gameState.jays.pos_y + gameState.jays.height / 2,
                    this.attack_direction_event.directions[0]));
            }
        }
        else {
            timer_tear.reset();
        }

        gameState.tears.forEach(function (tear) {
            switch (tear.direction) {
                case Direction.UP: tear.move_direction(Direction.UP); break;
                case Direction.DOWN: tear.move_direction(Direction.DOWN); break;
                case Direction.LEFT: tear.move_direction(Direction.LEFT); break;
                case Direction.RIGHT: tear.move_direction(Direction.RIGHT); break;
            }
        });
    }

    get_timer(id) {
        return gameState.timers.find(item => item.id === id);
    }
}

enum Direction {
    UP = "Up",
    DOWN = "Down",
    LEFT = "Left",
    RIGHT = "Right"
};

class DirectionEvent {
    public move_up: any;
    public move_down: any;
    public move_left: any;
    public move_right: any;

    constructor() {
        this.move_up = false;
        this.move_down = false;
        this.move_left = false;
        this.move_right = false;
    }
}

class AttackDirectionEvent {
    public directions: any;

    constructor() {
        // To manage the multi-key press
        // Taking always the first Direction of this array,
        // even though the user presses many attack keys in same time
        // and then releases them, only the last pressed will be taken into account
        this.directions = Array();
    }

    add(direction) {
        ArrayUtil.addFirstNoDuplicate(this.directions, direction);
    }

    remove(direction) {
        ArrayUtil.removeFromArray(this.directions, direction);
    }
}