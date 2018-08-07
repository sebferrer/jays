import { gameState, canvas_W, canvas_H, ctx, renderer } from "./main";
import { TearBasic, TEAR_BASIC, Tear } from "./tear";
import { Map } from "./map";
import { Jays } from "./jays";
import { Timer } from "./timer";
import { DirectionEvent } from "./direction_event";
import { AttackDirectionEvent } from "./attack_direction_event";
import { Direction } from "./enum";

export class GameState {

	public current_map: Map;
	public jays: Jays;
	public direction_event: DirectionEvent;
	public attack_direction_event: AttackDirectionEvent;
	public timers: Timer[];
	public tears: Tear[];

	constructor(map: Map) {
		this.current_map = map;
		this.direction_event = new DirectionEvent();
		this.attack_direction_event = new AttackDirectionEvent();
		this.timers = new Array<Timer>();
		this.tears = new Array<Tear>();
	}

	public key_down(keyName: string): void {
		switch (keyName) {
			case "z": this.direction_event.move_up = true; break;
			case "s": this.direction_event.move_down = true; break;
			case "q": this.direction_event.move_left = true; break;
			case "d": this.direction_event.move_right = true; break;

			case "ArrowUp": this.attack_direction_event.add(Direction.UP); break;
			case "ArrowDown": this.attack_direction_event.add(Direction.DOWN); break;
			case "ArrowLeft": this.attack_direction_event.add(Direction.LEFT); break;
			case "ArrowRight": this.attack_direction_event.add(Direction.RIGHT); break;
		}
	}

	public key_up(keyName: string): void {
		switch (keyName) {
			case "z": this.direction_event.move_up = false; break;
			case "s": this.direction_event.move_down = false; break;
			case "q": this.direction_event.move_left = false; break;
			case "d": this.direction_event.move_right = false; break;

			case "ArrowUp": this.attack_direction_event.remove(Direction.UP); break;
			case "ArrowDown": this.attack_direction_event.remove(Direction.DOWN); break;
			case "ArrowLeft": this.attack_direction_event.remove(Direction.LEFT); break;
			case "ArrowRight": this.attack_direction_event.remove(Direction.RIGHT); break;
		}
	}

	public update(): void {
		ctx.save();
		ctx.clearRect(0, 0, canvas_W, canvas_H);

		gameState.timers.forEach(function (timer) {
			timer.run();
		});
		//console.log(gameState.get_timer("test").tick); // 1 tick every second

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

	public jays_update(): void {
		if (this.direction_event.move_up) { this.jays.move_direction(Direction.UP); }
		if (this.direction_event.move_down) { this.jays.move_direction(Direction.DOWN); }
		if (this.direction_event.move_left) { this.jays.move_direction(Direction.LEFT); }
		if (this.direction_event.move_right) { this.jays.move_direction(Direction.RIGHT); }
	}

	public tears_update(): void {
		let timer_tear = gameState.get_timer("tear");
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

	public get_timer(id: string): Timer {
		return gameState.timers.find(item => item.id === id);
	}
}