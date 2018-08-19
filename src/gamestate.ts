import { gameState, canvas_W, canvas_H, ctx, renderer } from "./main";
import { TearBasic, Tear } from "./tear";
import { RoomMap } from "./room_map";
import { Jays } from "./jays";
import { Timer } from "./timer";
import { DirectionEvent } from "./direction_event";
import { AttackDirectionEvent } from "./attack_direction_event";
import { Direction, Key_Direction } from "./enum";
import { Sprite } from "./sprite";
import { ArrayUtil } from "./util";
import { TIMERS } from "./timers";

export class GameState {
	public current_map: RoomMap;
	public jays: Jays;
	public direction_event: DirectionEvent;
	public directions_keyDown: Direction[];
	public attack_direction_event: AttackDirectionEvent;
	public tears: Tear[];

	constructor(map: RoomMap) {
		this.current_map = map;
		this.direction_event = new DirectionEvent();
		this.directions_keyDown = new Array<Direction>();
		this.attack_direction_event = new AttackDirectionEvent();
		this.tears = new Array<Tear>();
	}

	public key_down(keyName: string): void {
		switch (keyName) {
			case "z":
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.UP)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_up = true;
				break;
			case "s":
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.DOWN)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_down = true;
				break;
			case "q":
				if (ArrayUtil.addFirstNoDuplicate(this.directions_keyDown, Direction.LEFT)) {
					this.get_timer("jays_sprites").restart();
				}
				this.direction_event.move_left = true;
				break;
			case "d":
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

		if (["z", "s", "q", "d"].find(s => s === keyName)) {
			ArrayUtil.removeFromArray(this.directions_keyDown, Key_Direction.get(keyName));
			this.direction_event.setDirection(Key_Direction.get(keyName), false);

			this.jays.direction_key_up(Key_Direction.get(keyName));
		}
	}

	public update(): void {
		ctx.save();
		ctx.clearRect(0, 0, canvas_W, canvas_H);

		TIMERS.forEach(timer => timer.run());

		try {
			renderer.render_map(this.current_map);
		} catch (err) { }

		this.tears.forEach(function (tear) {
			renderer.render_tear(tear);
		});

		this.jays.update();
		this.tears_update();

		try {
			renderer.render_jays();
		} catch (err) {
			console.error(err);
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
					this.jays.head.pos_x + this.jays.head.width / 2,
					this.jays.head.pos_y + this.jays.head.height / 2,
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
			this.tears.splice(0, gameState.tears.length);
		} else {
			this.tears = new Array<Tear>();
		}
	}

	public get_timer(id: string): Timer {
		return TIMERS.find(item => item.id === id);
	}
}