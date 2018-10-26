import { AttackDirectionEvent } from "./attack_direction_event";
import { AudioFile } from "./audio_file";
import { Jays } from "./character/jays";
import { Tear, TearBasic } from "./character/tear";
import { DirectionEvent } from "./direction_event";
import { Arrow_Direction, Direction } from "./enum";
import { Floor } from "./environment/floors/floor";
import { TempleFloor } from "./environment/floors/one/temple_floor";
import { RoomMap } from "./environment/rooms/room_map";
import { Joystick } from "./joystick";
import { Joysticks } from "./joysticks";
import { canvas_H, canvas_W, static_ctx, key_mapper, renderer } from "./main";
import { Point } from "./point";
import { Timer } from "./timer";
import { TIMERS } from "./timers";
import { TouchHelper } from "./touch_helper";
import { ArrayUtil, SetUtil } from "./util";

export class GameState {
	public current_map: RoomMap;
	public current_floor: Floor;
	public jays: Jays;
	public direction_event: DirectionEvent;
	public directions_keyDown: Set<Direction>;
	public attack_direction_event: AttackDirectionEvent;
	public tears: Tear[];
	public joysticks: Joysticks;
	public touches: TouchList;

	constructor() {
		this.current_floor = new TempleFloor();
		this.current_floor.initialize();
		this.current_map = this.current_floor.floor_map.current_room;

		this.direction_event = new DirectionEvent();
		this.directions_keyDown = new Set<Direction>();
		this.attack_direction_event = new AttackDirectionEvent();
		this.tears = new Array<Tear>();

		this.joysticks = new Joysticks();

		this.jays = new Jays();
		document.onkeyup = event => this.key_up(event.key);
		document.onkeydown = event => this.key_down(event.key);

		document.ontouchstart = event => this.touch_start(event.touches);
		document.ontouchend = event => this.touch_end(event.touches);
		document.ontouchmove = event => { this.touches = event.touches; };
	}

	public touch_start(touches: TouchList): void {
		const touches_array = TouchHelper.touchlist_to_id_array(this.touches);
		const new_touches_array = TouchHelper.touchlist_to_id_array(touches);
		const new_touch = TouchHelper.get_touch_by_identifier(touches, ArrayUtil.diff(new_touches_array, touches_array)[0]);

		this.touches = touches;
		const touch_x = new_touch.pageX;
		const touch_y = new_touch.pageY;
		if (touch_x < (window.innerWidth / 2)) {
			this.joysticks.left = new Joystick("LEFT", new Point(touch_x, touch_y), 40,
				new Point(touch_x, touch_y), 20, new_touch.identifier, () => { this.clear_direction_event(); });
		}
		else {
			this.joysticks.right = new Joystick("RIGHT", new Point(touch_x, touch_y), 40,
				new Point(touch_x, touch_y), 20, new_touch.identifier, () => { this.attack_direction_event.clear(); });
		}
	}

	public touch_end(touches: TouchList): void {
		const touches_array = TouchHelper.touchlist_to_id_array(this.touches);
		const new_touches_array = TouchHelper.touchlist_to_id_array(touches);
		const touches_removed = ArrayUtil.diff(touches_array, new_touches_array);

		const joysticks_to_remove = [this.joysticks.left, this.joysticks.right].filter(j => j != null && touches_removed.indexOf(j.touch_identifier) > -1);

		this.touches = touches;

		for (let i = 0; i < joysticks_to_remove.length; ++i) {
			joysticks_to_remove[i].remove_events_callback();
			joysticks_to_remove[i].destroy();
			this.joysticks.remove(joysticks_to_remove[i]);
			delete joysticks_to_remove[i];
		}
	}

	public touch_move(): void {
		if (this.joysticks.is_empty()) {
			return;
		}

		const joystick_left = this.joysticks.left;
		if (joystick_left != null) {
			const touch_left = TouchHelper.get_touch_by_identifier(this.touches, joystick_left.touch_identifier);
			if (touch_left == null) {
				return;
			}
			joystick_left.move(touch_left.pageX, touch_left.pageY);
			if (joystick_left.coeff_x < -0.5) {
				this.add_direction_event(Direction.LEFT);
				this.remove_direction_event(Direction.RIGHT);
			}
			else if (joystick_left.coeff_x > 0.5) {
				this.add_direction_event(Direction.RIGHT);
				this.remove_direction_event(Direction.LEFT);
			}
			else {
				this.remove_direction_event(Direction.LEFT);
				this.remove_direction_event(Direction.RIGHT);
			}
			if (joystick_left.coeff_y < -0.5) {
				this.add_direction_event(Direction.DOWN);
				this.remove_direction_event(Direction.UP);
			}
			else if (joystick_left.coeff_y > 0.5) {
				this.add_direction_event(Direction.UP);
				this.remove_direction_event(Direction.DOWN);
			}
			else {
				this.remove_direction_event(Direction.DOWN);
				this.remove_direction_event(Direction.UP);
			}
		}

		const joystick_right = this.joysticks.right;
		if (joystick_right != null) {
			const touch_right = TouchHelper.get_touch_by_identifier(this.touches, joystick_right.touch_identifier);
			if (touch_right == null) {
				return;
			}
			joystick_right.move(touch_right.pageX, touch_right.pageY);
			if (joystick_right.coeff_x < -0.5) {
				this.add_attack_event(Direction.LEFT);
				this.remove_attack_event(Direction.RIGHT);
			}
			else if (joystick_right.coeff_x > 0.5) {
				this.add_attack_event(Direction.RIGHT);
				this.remove_attack_event(Direction.LEFT);
			}
			else {
				this.remove_attack_event(Direction.LEFT);
				this.remove_attack_event(Direction.RIGHT);
			}
			if (joystick_right.coeff_y < -0.5) {
				this.add_attack_event(Direction.DOWN);
				this.remove_attack_event(Direction.UP);
			}
			else if (joystick_right.coeff_y > 0.5) {
				this.add_attack_event(Direction.UP);
				this.remove_attack_event(Direction.DOWN);
			}
			else {
				this.remove_attack_event(Direction.DOWN);
				this.remove_attack_event(Direction.UP);
			}
		}
	}

	public add_direction_event(direction: Direction): void {
		if (direction != null) {
			if (SetUtil.add_first_no_duplicate(this.directions_keyDown, direction)) {
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
		if (direction != null && SetUtil.remove_from_array(this.directions_keyDown, direction)) {
			this.direction_event.setDirection(direction, false);
			this.jays.direction_key_up(direction);
		}
	}

	public clear_direction_event(): void {
		this.remove_direction_event(Direction.UP);
		this.remove_direction_event(Direction.LEFT);
		this.remove_direction_event(Direction.DOWN);
		this.remove_direction_event(Direction.RIGHT);
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
		static_ctx.save();
		static_ctx.clearRect(0, 0, canvas_W, canvas_H);

		TIMERS.forEach(timer => timer.run());

		this.current_map.draw(static_ctx);

		this.tears.forEach(tear => {
			tear.draw(static_ctx);
		});

		this.jays.update();
		this.tears_update();

		this.jays.draw(static_ctx);

		this.touch_move();

		static_ctx.restore();

		const self = this;
		window.requestAnimationFrame(() => self.update());
	}

	public tears_update(): void {
		const timer_tear = this.get_timer("tear");
		if (this.attack_direction_event.directions.length > 0) {
			timer_tear.enable();
			if (timer_tear.next_tick()) {
				const new_tear = new TearBasic(
					new Point(this.jays.position.x + this.jays.width / 2, this.jays.position.y + this.jays.height / 2),
					this.attack_direction_event.directions[0]
				);
				this.tears.push(new_tear);
				new_tear.firing_sound.play();
			}
		} else {
			timer_tear.reset();
		}

		this.tears.forEach(tear => tear.move());
	}

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