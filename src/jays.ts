import { Entity } from "./entity";
import { gameState, canvas_H, canvas_W } from "./main";
import { RoomMap, TILE_REF } from "./room_map";
import { Direction, Direction_Int, Direction_String, WarpType } from "./enum";
import { Sprite } from "./sprite";
import { Position } from "./position";
import { CollisionWarp } from "./collision_warp";
import { CollisionDelta } from "./collision_delta";

export class Jays extends Entity {
	public width: number;
	public height: number;
	public pos_x: number;
	public pos_y: number;
	public tear_delay: number;
	public head: JaysHead;

	constructor() {
		super("jays", new Sprite(0, 20, 20, 20), canvas_W / 2 - 10, canvas_H / 2 - 20, 20, 20);
		this.sprite_filename = "assets/img/jays.png";
		this.speed = 2;
		this.tear_delay = 250;
		this.head = new JaysHead("jays_head", new Sprite(0, 0, 20, 20), this.pos_x, this.pos_y - 20, 20, 20);
	}

	public move_direction(direction: Direction) {
		super.move_direction(direction);
		this.head.pos_x = this.pos_x;
		this.head.pos_y = this.pos_y - this.head.height;
	}

	public collision_map(direction: Direction, position: Position): CollisionDelta {
		const result = super.collision_map(direction, position);
		if (!result.is_collision) {
			return this.head.collision_map(direction, new Position(position.pos_x, position.pos_y - this.head.height));
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
		gameState.current_map = new RoomMap(collision_warp.warp_info.destination);
		switch (collision_warp.warp_info.type) {
			case WarpType.CLASSIC:
				if (collision_warp.tile.coord_y === gameState.current_map.height - 1) {
					this.pos_y = 0 + TILE_REF.height + this.head.height;
				}
				else if (collision_warp.tile.coord_y === 0) {
					this.pos_y = canvas_H - this.height - TILE_REF.height;
				}
				else if (collision_warp.tile.coord_x === gameState.current_map.width - 1) {
					this.pos_x = 0 + TILE_REF.width;
				}
				else if (collision_warp.tile.coord_x === 0) {
					this.pos_x = canvas_W - this.width - TILE_REF.height;
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
}

export class JaysHead extends Entity {
	public width: number;
	public height: number;
	public pos_x: number;
	public pos_y: number;

	constructor(id: string, current_sprite: Sprite, pos_x: number, pos_y: number, width: number, height: number) {
		super(id, current_sprite, pos_x, pos_y, width, height);
		this.sprite_filename = "assets/img/jays.png";
	}

	public on_collision_map(): void { }

	public on_collision_warp(collision_warp: CollisionWarp): void { }
}