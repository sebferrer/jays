import { Entity } from "./entity";
import { gameState, canvas_H, canvas_W } from "./main";
import { RoomMap, TILE_REF } from "./room_map";
import { Direction, Direction_Int, Direction_String } from "./enum";
import { Tear } from "./tear";
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

	constructor(current_sprite: Sprite, width: number, height: number, pos_x: number, pos_y: number) {
		super(current_sprite, width, height, pos_x, pos_y);
		this.sprite_filename = "assets/img/jays.png";
		this.speed = 2;
		this.tear_delay = 250;
		this.head = new JaysHead(new Sprite(0, 0, 20, 20), 20, 20, this.pos_x, this.pos_y - 20);
	}

	public move_direction(direction: Direction) {
		super.move_direction(direction);

		this.head.pos_x = this.pos_x;
		this.head.pos_y = this.pos_y - this.head.height;
	}

	public collision_map(direction: Direction, position: Position): CollisionDelta {
		let result = super.collision_map(direction, position);
		if(!result.is_collision) {
			return this.head.collision_map(direction, new Position(position.pos_x, position.pos_y-this.head.height));
		}
		return result;
	}

	public collision_warp(): CollisionWarp {
		let result = super.collision_warp();
		if(!result.is_collision) {
			return this.head.collision_warp();
		}
		return result;
	}

	public has_collision_warp(direction: Direction, collision_warp: CollisionWarp): void {
		gameState.current_map = new RoomMap(collision_warp.destination);
		// To change after warps improvement, see warp.js
		switch (direction) {
			case Direction.UP: this.pos_y = canvas_H - this.height - TILE_REF.height; break;
			case Direction.DOWN: this.pos_y = 0 + TILE_REF.height+this.head.height; break;
			case Direction.LEFT: this.pos_x = canvas_W - this.width - TILE_REF.height; break;
			case Direction.RIGHT: this.pos_x = 0 + TILE_REF.width; break;
		}
		gameState.tears = new Array<Tear>();
	}

	public update(): void {
		let timer_sprites = gameState.get_timer('jays_sprites');
		if (this.sprite_collecs.has(this.current_sprite.collec_id)) {
			if (timer_sprites.tick >= this.sprite_collecs.get(this.current_sprite.collec_id).length) {
				timer_sprites.restart();
			}
		}

		// DIRECTION EVENT
		let self = this;
		gameState.direction_event.getAllDirectionsValues().forEach(function (dir_event_move) {
			if (dir_event_move.enabled) {
				self.move_direction(dir_event_move.direction);
				// By default the head turn to the direction of the body but the attack direction has the priority.
				if (gameState.attack_direction_event.directions.length === 0) {
					self.head.current_sprite = self.head.sprite_collecs.get("HEAD")[Direction_Int.get(dir_event_move.direction)];
				}
				self.current_sprite = self.sprite_collecs.get(Direction_String.get(dir_event_move.direction))[timer_sprites.tick];
			}
		});

		// ATTACK DIRECTION EVENT
		if (gameState.attack_direction_event.directions.length !== 0) {
			this.head.current_sprite = this.head.sprite_collecs.get("HEAD")[Direction_Int.get(gameState.attack_direction_event.directions[0])];
		}
	}
}

export class JaysHead extends Entity {
	public width: number;
	public height: number;
	public pos_x: number;
	public pos_y: number;

	constructor(current_sprite: Sprite, width: number, height: number, pos_x: number, pos_y: number) {
		super(current_sprite, width, height, pos_x, pos_y);
		this.sprite_filename = "assets/img/jays.png";
	}
}