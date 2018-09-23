import { canvas_W, canvas_H, ctx, renderer } from "./main";
import { TearBasic, Tear } from "./character/tear";
import { RoomMap } from "./environment/rooms/room_map";
import { Jays } from "./character/jays";
import { Timer } from "./timer";
import { DirectionEvent } from "./direction_event";
import { AttackDirectionEvent } from "./attack_direction_event";
import { Direction } from "./enum";
import { ArrayUtil } from "./util";
import { TIMERS } from "./timers";
import { Floor } from "./environment/floor";
import { Point } from "./point";
import { key_mapper } from "./main";

export class GameState {
	public current_map: RoomMap;
	public current_floor: Floor;
	public jays: Jays;
	public direction_event: DirectionEvent;
	public directions_keyDown: Direction[];
	public attack_direction_event: AttackDirectionEvent;
	public tears: Tear[];

	constructor() {
		this.current_floor = new Floor(1, "", "");
		this.current_map = this.current_floor.floor_map[this.current_floor.current_position.x][this.current_floor.current_position.y];
		this.direction_event = new DirectionEvent();
		this.directions_keyDown = new Array<Direction>();
		this.attack_direction_event = new AttackDirectionEvent();
		this.tears = new Array<Tear>();

		this.jays = new Jays();
		document.onkeyup = event => this.key_up(event.key);
		document.onkeydown = event => this.key_down(event.key);
	}

	public key_down(keyName: string): void {

		const direction = key_mapper.current_keyboard.get(keyName);
		if (direction != null) {
			if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, direction)) {
				this.get_timer("jays_sprites").restart();
			}
			this.direction_event.move_up = direction === Direction.UP || this.direction_event.move_up;
			this.direction_event.move_down = direction === Direction.DOWN || this.direction_event.move_down;
			this.direction_event.move_left = direction === Direction.LEFT || this.direction_event.move_left;
			this.direction_event.move_right = direction === Direction.RIGHT || this.direction_event.move_right;
			return;
		}

		switch (keyName) {
			case "ArrowUp":
				this.attack_direction_event.add(Direction.UP);
				break;
			case "ArrowDown":
				this.attack_direction_event.add(Direction.DOWN);
				break;
			case "ArrowLeft":
				this.attack_direction_event.add(Direction.LEFT);
				break;
			case "ArrowRight":
				this.attack_direction_event.add(Direction.RIGHT);
				break;

			case "f":
				renderer.scale();
				break;
		}
	}

	public key_up(keyName: string): void {
		switch (keyName) {
			case "ArrowUp":
				this.attack_direction_event.remove(Direction.UP);
				break;
			case "ArrowDown":
				this.attack_direction_event.remove(Direction.DOWN);
				break;
			case "ArrowLeft":
				this.attack_direction_event.remove(Direction.LEFT);
				break;
			case "ArrowRight":
				this.attack_direction_event.remove(Direction.RIGHT);
				break;
		}

		const direction = key_mapper.current_keyboard.get(keyName);

		if (direction != null) {
			ArrayUtil.removeFromArray(this.directions_keyDown, direction);
			this.direction_event.setDirection(direction, false);
			this.jays.direction_key_up(direction);
		}
	}

	public update(): void {
		ctx.save();
		ctx.clearRect(0, 0, canvas_W, canvas_H);

		TIMERS.forEach(timer => timer.run());

		try {
			this.current_map.draw(ctx);
		} catch (err) {
			// console.error(err);
		}

		this.tears.forEach(tear => {
			tear.draw(ctx);
		});

		this.jays.update();
		this.tears_update();

		try {
			this.jays.draw(ctx);
		} catch (err) {
			// console.error(err);
		}

		ctx.restore();

		const self = this;
		window.requestAnimationFrame(() => self.update());
	}

	public tears_update(): void {
		const timer_tear = this.get_timer("tear");
		if (this.attack_direction_event.directions.length > 0) {
			timer_tear.enable();
			if (timer_tear.next_tick()) {
				this.tears.push(
					new TearBasic(
						new Point(this.jays.position.x + this.jays.width / 2, this.jays.position.y + this.jays.height / 2),
						this.attack_direction_event.directions[0]
					)
				);
			}
		} else {
			timer_tear.reset();
		}

		this.tears.forEach(tear => tear.move());
	}

	/** Removes all the tear which are currently displayed */
	public clear_tears(): void {
		if (this.tears != null) {
			this.tears.splice(0, this.tears.length);
		} else {
			this.tears = new Array<Tear>();
		}
	}

	public get_timer(id: string): Timer {
		return TIMERS.find(item => item.id === id);
	}
}