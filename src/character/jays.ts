import { Entity } from "../entity";
import { gameState, canvas_H, canvas_W, bank } from "../main";
import { RoomMap, TILE_REF } from "../environment/room_map";
import { Direction, Direction_Int, Direction_String, WarpType } from "../enum";
import { Sprite } from "../sprite";
import { Point } from "../point";
import { CollisionWarp } from "../collision_warp";
import { CollisionDelta } from "../collision_delta";
import { IDrawable } from "../idrawable";
import { FloorOneRoom } from "../environment/wall";

export class Jays extends Entity implements IDrawable {
	public tear_delay: number;
	public range: number;
	public head: JaysHead;

	constructor() {
		super("jays", new Sprite(0, 20, 20, 20), new Point(canvas_W / 2 - 10, canvas_H / 2 - 20), 20, 20);
		this.sprite_filename = "assets/img/jays.png";
		this.speed = 2;
		this.tear_delay = 480;
		this.range = 8;
		this.head = new JaysHead("jays_head", new Sprite(0, 0, 20, 20), new Point(this.pos.x, this.pos.y - 20), 20, 20);
	}

	public move_direction(direction: Direction) {
		super.move_direction(direction);
		this.head.pos.x = this.pos.x;
		this.head.pos.y = this.pos.y - this.head.height;
	}

	public collision_map(direction: Direction, position: Point): CollisionDelta {
		const result = super.collision_map(direction, position);
		if (!result.is_collision) {
			return this.head.collision_map(direction, new Point(position.x, position.y - this.head.height));
		}
		return result;
	}

	public get_collision_warp(): CollisionWarp | null {
		const result = super.get_collision_warp();
		if (result != null) {
			return this.head.get_collision_warp();
		}
		return result;
	}

	public on_collision_map(): void { }

	public on_collision_warp(collision_warp: CollisionWarp): void {
		gameState.current_map = new RoomMap(collision_warp.warp_info.destination, new FloorOneRoom());
		switch (collision_warp.warp_info.type) {
			case WarpType.CLASSIC:
				if (collision_warp.tile.coord_y === gameState.current_map.height - 1) {
					this.pos.y = 0 + TILE_REF.height + this.head.height;
				}
				else if (collision_warp.tile.coord_y === 0) {
					this.pos.y = canvas_H - this.height - TILE_REF.height;
				}
				else if (collision_warp.tile.coord_x === gameState.current_map.width - 1) {
					this.pos.x = 0 + TILE_REF.width;
				}
				else if (collision_warp.tile.coord_x === 0) {
					this.pos.x = canvas_W - this.width - TILE_REF.width;
				}
				break;
		}
		gameState.clear_tears();
	}

	public update(): void {
		const timer_sprites = gameState.get_timer("jays_sprites");
		if (this.sprite_collecs.has(this.current_sprite.collec_id) &&
			timer_sprites.tick >= this.sprite_collecs.get(this.current_sprite.collec_id).length) {
			timer_sprites.restart();
		}

		// DIRECTION EVENT
		const self = this;
		gameState.direction_event.getAllDirectionsValues()
			.filter(dir_event_move => dir_event_move.enabled)
			.forEach(dir_event_move => {
				self.move_direction(dir_event_move.direction);
				// By default the head turn to the direction of the body but the attack direction has the priority.
				if (gameState.attack_direction_event.directions.length === 0) {
					self.head.current_sprite = self.head.sprite_collecs.get("HEAD")[Direction_Int.get(dir_event_move.direction)];
				}
				self.current_sprite = self.sprite_collecs.get(Direction_String.get(dir_event_move.direction))[timer_sprites.tick];
			});

		// ATTACK DIRECTION EVENT
		if (gameState.attack_direction_event.directions.length !== 0) {
			this.head.current_sprite = this.head.sprite_collecs.get("HEAD")[Direction_Int.get(gameState.attack_direction_event.directions[0])];
		}
	}

	public direction_key_up(direction: Direction): void {
		if (gameState.directions_keyDown.length > 0) {
			gameState.get_timer("jays_sprites").restart();
			return;
		}
		gameState.get_timer("jays_sprites").reset();
		this.current_sprite = this.sprite_collecs.get("MOTIONLESS")[Direction_Int.get(direction)];
	}

	public set_tear_delay(new_tear_delay: number): void {
		this.tear_delay = new_tear_delay;
		gameState.get_timer("tear").interval = this.tear_delay;
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.drawImage(bank.pic[this.sprite_filename],
			this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
			this.pos.x, this.pos.y, this.width, this.height);

		ctx.drawImage(bank.pic[this.sprite_filename],
			this.head.current_sprite.src_x, this.head.current_sprite.src_y, this.head.current_sprite.src_width, this.head.current_sprite.src_height,
			this.head.pos.x, this.head.pos.y, this.head.width, this.head.height);
	}
}

export class JaysHead extends Entity {
	constructor(id: string, current_sprite: Sprite, pos: Point, width: number, height: number) {
		super(id, current_sprite, new Point(pos.x, pos.y), width, height);
		this.sprite_filename = "assets/img/jays.png";
	}

	public on_collision_map(): void { }

	public on_collision_warp(collision_warp: CollisionWarp): void { }
}