import { Entity } from "../entity";
import { gameState, canvas_H, canvas_W, IMAGE_BANK } from "../main";
import { Direction, Direction_Int, Direction_String } from "../enum";
import { Sprite } from "../sprite";
import { Point } from "../point";
import { IDrawable } from "../idrawable";
import { Collision } from "../collision";

export class Jays extends Entity implements IDrawable {
	private _tear_delay: number;
	public get tear_delay(): number { return this._tear_delay; }
	public set tear_delay(new_tear_delay: number) {
		this._tear_delay = new_tear_delay;
		gameState.get_timer("tear").interval = this._tear_delay;
	}

	private _range: number;
	public get range(): number { return this._range; }
	public set range(value: number) {
		if (value == null || value <= 0) {
			throw new Error("Property `range` cannot be null or <= 0");
		}
		this._range = value;
	}

	protected head: JaysHead;

	private static body_height = 20;
	private static body_width = 20;
	private static head_height = 20;
	private static head_width = 20;

	constructor() {
		// height is = body height + head height...
		super("jays", new Sprite(0, 20, 20, 20), new Point(canvas_W / 2 - 10, canvas_H / 2 - 20),
			Jays.body_width, Jays.body_height + Jays.head_height);
		this.sprite_filename = "assets/img/jays.png";
		this.speed = 3;
		this._tear_delay = 480;
		this.range = 16;
		this.head = new JaysHead("jays_head", new Sprite(0, 0, 20, 20), new Point(this.position.x, this.position.y - 20), Jays.head_width, Jays.head_height);
	}

	public move_direction(direction: Direction): void {
		super.move_direction(direction);

		// Warp with doors ?
		const collided_door = gameState.current_map.room_walls.doors
			.find(door => Collision.is_collision_rectangle(this, door.get_exit_rectangle()));
		if (collided_door != null) {
			gameState.current_floor.on_collision_warp(collided_door);
			return;
		}
	}

	public update(): void {
		const timer_sprites = gameState.get_timer("jays_sprites");
		if (this.sprite_collecs.has(this.current_sprite.collec_id) &&
			timer_sprites.tick >= this.sprite_collecs.get(this.current_sprite.collec_id).length) {
			timer_sprites.restart();
		}

		// DIRECTION EVENT
		gameState.direction_event.getAllDirectionsValues()
			.filter(dir_event_move => dir_event_move.enabled)
			.forEach(dir_event_move => {
				this.move_direction(dir_event_move.direction);
				// By default the head turn to the direction of the body but the attack direction has the priority.
				if (gameState.attack_direction_event.directions.length === 0) {
					this.head.current_sprite = this.head.sprite_collecs.get("HEAD")[Direction_Int.get(dir_event_move.direction)];
				}
				this.current_sprite = this.sprite_collecs.get(Direction_String.get(dir_event_move.direction))[timer_sprites.tick];
			});

		// ATTACK DIRECTION EVENT
		if (gameState.attack_direction_event.directions.length !== 0) {
			this.head.current_sprite = this.head.sprite_collecs.get("HEAD")[Direction_Int.get(gameState.attack_direction_event.directions[0])];
		}
	}

	public direction_key_up(direction: Direction): void {
		if (gameState.directions_keyDown.size > 0) {
			gameState.get_timer("jays_sprites").restart();
			return;
		}
		gameState.get_timer("jays_sprites").reset();
		this.current_sprite = this.sprite_collecs.get("MOTIONLESS")[Direction_Int.get(direction)];
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		// Draw body
		ctx.drawImage(IMAGE_BANK.pictures[this.sprite_filename],
			this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
			this.position.x, this.position.y + Jays.head_height, Jays.body_width, Jays.body_height);

		// Draw head
		ctx.drawImage(IMAGE_BANK.pictures[this.sprite_filename],
			this.head.current_sprite.src_x, this.head.current_sprite.src_y, this.head.current_sprite.src_width, this.head.current_sprite.src_height,
			this.position.x, this.position.y, Jays.head_width, Jays.head_height);
	}
}

class JaysHead extends Entity {
	constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number) {
		super(id, current_sprite, Point.copy(position), width, height);
		this.sprite_filename = "assets/img/jays.png";
	}
}