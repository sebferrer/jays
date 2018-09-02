import { canvas_W, canvas_H, ctx, renderer } from "./main";
import { TearBasic, Tear } from "./tear";
import { RoomMap } from "./room_map";
import { Jays } from "./jays";
import { Timer } from "./timer";
import { DirectionEvent } from "./direction_event";
import { AttackDirectionEvent } from "./attack_direction_event";
import { Direction, Key_Direction, KeyboardType } from "./enum";
import { ArrayUtil } from "./util";
import { TIMERS } from "./timers";
import { Floor } from "./floor";
import { Point } from "./point";
import { Keyboard } from "./keyboard";

export class GameState {
	public current_map: RoomMap;
	public current_floor: Floor;
	public jays: Jays;
	public direction_event: DirectionEvent;
	public directions_keyDown: Direction[];
	public attack_direction_event: AttackDirectionEvent;
	public tears: Tear[];
	public keyboard: Keyboard;

	constructor(map: RoomMap) {
		this.current_map = map;
		this.direction_event = new DirectionEvent();
		this.directions_keyDown = new Array<Direction>();
		this.attack_direction_event = new AttackDirectionEvent();
		this.tears = new Array<Tear>();

		this.jays = new Jays();
		this.keyboard = new Keyboard(KeyboardType.AZERTY);
		document.onkeyup = event => this.key_up(event.key);
		document.onkeydown = event => this.key_down(event.key);
	}

	public key_down(keyName: string): void {
		switch (keyName) {
			case this.keyboard.get(Direction.UP):
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.UP)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_up = true;
				break;
			case this.keyboard.get(Direction.DOWN):
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.DOWN)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_down = true;
				break;
			case this.keyboard.get(Direction.LEFT):
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.LEFT)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_left = true;
				break;
			case this.keyboard.get(Direction.RIGHT):
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.RIGHT)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_right = true;
				break;

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

		if ([this.keyboard.get(Direction.UP), this.keyboard.get(Direction.DOWN),
		this.keyboard.get(Direction.LEFT), this.keyboard.get(Direction.RIGHT)]
			.find(s => s === keyName)) {
			ArrayUtil.removeFromArray(this.directions_keyDown, Key_Direction.get(this.keyboard.type).get(keyName));
			this.direction_event.setDirection(Key_Direction.get(this.keyboard.type).get(keyName), false);

			this.jays.direction_key_up(Key_Direction.get(this.keyboard.type).get(keyName));
		}
	}

	public update(): void {
		ctx.save();
		ctx.clearRect(0, 0, canvas_W, canvas_H);

		TIMERS.forEach(timer => timer.run());

		try {
			renderer.render_map(this.current_map);
		} catch (err) {
			// console.error(err);
		}

		this.tears.forEach(function (tear) {
			renderer.render_tear(tear);
		});

		this.jays.update();
		this.tears_update();

		try {
			renderer.render_jays();
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
				this.tears.push(new TearBasic(
					new Point(this.jays.head.pos.x + this.jays.head.width / 2,
						this.jays.head.pos.y + this.jays.head.height / 2),
					this.attack_direction_event.directions[0]));
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