import { canvas_W, canvas_H, ctx, renderer, window_W } from "./main";
import { TearBasic, Tear } from "./character/tear";
import { RoomMap } from "./environment/rooms/room_map";
import { Jays } from "./character/jays";
import { Timer } from "./timer";
import { DirectionEvent } from "./direction_event";
import { AttackDirectionEvent } from "./attack_direction_event";
import { Direction, Arrow_Direction } from "./enum";
import { ArrayUtil } from "./util";
import { TIMERS } from "./timers";
import { Floor } from "./environment/floor";
import { Point } from "./point";
import { key_mapper } from "./main";
import { Joystick } from "./joystick";

export class GameState {
	public current_map: RoomMap;
	public current_floor: Floor;
	public jays: Jays;
	public direction_event: DirectionEvent;
	public directions_keyDown: Direction[];
	public attack_direction_event: AttackDirectionEvent;
	public tears: Tear[];
	public joysticks: Joystick[];
	public touches: TouchList;

	constructor() {
		this.current_floor = new Floor(1, "", "");
		this.current_floor.initialize();
		this.current_map = this.current_floor.floor_map.current_room;

		this.direction_event = new DirectionEvent();
		this.directions_keyDown = new Array<Direction>();
		this.attack_direction_event = new AttackDirectionEvent();
		this.tears = new Array<Tear>();

		this.joysticks = new Array<Joystick>();

		this.jays = new Jays();
		document.onkeyup = event => this.key_up(event.key);
		document.onkeydown = event => this.key_down(event.key);

		document.ontouchstart = event => this.touch_start(event.touches);
		document.ontouchend = event => this.touch_end(event.touches);
		document.ontouchmove = event => { this.touches = event.touches; };
	}

	public touch_start(touches): void {
		const touches_array = ArrayUtil.touchlist_to_id_array(this.touches);
		const new_touches_array = ArrayUtil.touchlist_to_id_array(touches);
		const new_touch = ArrayUtil.get_touch_by_identifier(touches, ArrayUtil.diff(new_touches_array, touches_array)[0]);

		this.touches = touches;
		const touch_x = new_touch.pageX;
		const touch_y = new_touch.pageY;
		if (touch_x < (window_W / 2)) {
			if (!this.joysticks.find(joystick => joystick.id === "LEFT")) {
				this.joysticks.push(new Joystick("LEFT", new Point(touch_x, touch_y), 40,
					new Point(touch_x, touch_y), 20, new_touch.identifier));
			}
		}
		else {
			if (!this.joysticks.find(joystick => joystick.id === "RIGHT")) {
				this.joysticks.push(new Joystick("RIGHT", new Point(touch_x, touch_y), 40,
					new Point(touch_x, touch_y), 20, new_touch.identifier));
			}
		}
	}

	public touch_end(touches): void {
		const touches_array = ArrayUtil.touchlist_to_id_array(this.touches);
		const new_touches_array = ArrayUtil.touchlist_to_id_array(touches);
		const touches_removed = ArrayUtil.diff(touches_array, new_touches_array);

		const joysticks_to_remove = new Array<Joystick>();

		touches_removed.forEach(touch_identifier => {
			const joystick_to_remove = this.joysticks.find(joystick => joystick.touch_identifier === touch_identifier);
			if (joystick_to_remove != null) {
				joysticks_to_remove.push(joystick_to_remove);
			}
		});

		this.touches = touches;

		joysticks_to_remove.forEach(joystick => {
			joystick.div_zone.remove();
			joystick.div_controller.remove();
			ArrayUtil.remove_from_array(this.joysticks, joystick);
			switch (joystick.id) {
				case "LEFT":
					this.remove_direction_event(Direction.LEFT);
					this.remove_direction_event(Direction.RIGHT);
					this.remove_direction_event(Direction.DOWN);
					this.remove_direction_event(Direction.UP);
					break;
				case "RIGHT":
					this.remove_attack_event(Direction.LEFT);
					this.remove_attack_event(Direction.RIGHT);
					this.remove_attack_event(Direction.DOWN);
					this.remove_attack_event(Direction.UP);
					break;
			}
		});
	}

	public touch_move(): void {
		if (this.joysticks.length > 0) {
			for (let i = 0; i < this.joysticks.length; i++) {
				const joystick = this.joysticks[i];
				const touch = ArrayUtil.get_touch_by_identifier(this.touches, joystick.touch_identifier);
				if (touch != null) {
					joystick.move(touch.pageX, touch.pageY);
					switch (joystick.id) {
						case "LEFT":
							if (joystick.coeff_x < -0.5) {
								this.add_direction_event(Direction.LEFT);
								this.remove_direction_event(Direction.RIGHT);
							}
							else if (joystick.coeff_x > 0.5) {
								this.add_direction_event(Direction.RIGHT);
								this.remove_direction_event(Direction.LEFT);
							}
							else {
								this.remove_direction_event(Direction.LEFT);
								this.remove_direction_event(Direction.RIGHT);
							}
							if (joystick.coeff_y < -0.5) {
								this.add_direction_event(Direction.DOWN);
								this.remove_direction_event(Direction.UP);
							}
							else if (joystick.coeff_y > 0.5) {
								this.add_direction_event(Direction.UP);
								this.remove_direction_event(Direction.DOWN);
							}
							else {
								this.remove_direction_event(Direction.DOWN);
								this.remove_direction_event(Direction.UP);
							}
							break;
						case "RIGHT":
							if (joystick.coeff_x < -0.5) {
								this.add_attack_event(Direction.LEFT);
								this.remove_attack_event(Direction.RIGHT);
							}
							else if (joystick.coeff_x > 0.5) {
								this.add_attack_event(Direction.RIGHT);
								this.remove_attack_event(Direction.LEFT);
							}
							else {
								this.remove_attack_event(Direction.LEFT);
								this.remove_attack_event(Direction.RIGHT);
							}
							if (joystick.coeff_y < -0.5) {
								this.add_attack_event(Direction.DOWN);
								this.remove_attack_event(Direction.UP);
							}
							else if (joystick.coeff_y > 0.5) {
								this.add_attack_event(Direction.UP);
								this.remove_attack_event(Direction.DOWN);
							}
							else {
								this.remove_attack_event(Direction.DOWN);
								this.remove_attack_event(Direction.UP);
							}
							break;
					}
				}
			}
		}
	}

	public add_direction_event(direction: Direction): void {
		if (direction != null) {
			if (ArrayUtil.add_first_no_duplicate(this.directions_keyDown, direction)) {
				this.get_timer("jays_sprites").restart();
			}
			this.direction_event.move_up = direction === Direction.UP || this.direction_event.move_up;
			this.direction_event.move_down = direction === Direction.DOWN || this.direction_event.move_down;
			this.direction_event.move_left = direction === Direction.LEFT || this.direction_event.move_left;
			this.direction_event.move_right = direction === Direction.RIGHT || this.direction_event.move_right;
			return;
		}
	}

	public remove_direction_event(direction: Direction): void {
		if (direction != null) {
			if (ArrayUtil.remove_from_array(this.directions_keyDown, direction)) {
				this.direction_event.setDirection(direction, false);
				this.jays.direction_key_up(direction);
			}
		}
	}

	public add_attack_event(direction: Direction): void {
		if (direction != null) {
			this.attack_direction_event.add(direction);
		}
	}

	public remove_attack_event(direction: Direction): void {
		if (direction != null) {
			this.attack_direction_event.remove(direction);
		}
	}

	public key_down(keyName: string): void {
		const direction = key_mapper.current_keyboard.get(keyName);
		this.add_direction_event(direction);

		const arrow_direction = Arrow_Direction.get(keyName);
		this.add_attack_event(arrow_direction);

		switch (keyName) {
			case "f":
				renderer.scale();
				break;
		}
	}

	public key_up(keyName: string): void {
		const direction = key_mapper.current_keyboard.get(keyName);
		this.remove_direction_event(direction);

		const arrow_direction = Arrow_Direction.get(keyName);
		this.remove_attack_event(arrow_direction);
	}

	public update(): void {
		ctx.save();
		ctx.clearRect(0, 0, canvas_W, canvas_H);

		TIMERS.forEach(timer => timer.run());

		this.current_map.draw(ctx);

		this.tears.forEach(tear => {
			tear.draw(ctx);
		});

		this.jays.update();
		this.tears_update();

		this.jays.draw(ctx);

		this.touch_move();

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