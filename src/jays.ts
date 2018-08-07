import { Entity } from "./entity";
import { gameState, canvas_H, canvas_W } from "./main";
import { Map, TILE_REF } from "./map";
import { Direction } from "./enum";
import { Tear } from "./tear";

export class Jays extends Entity {

	public width: number;
	public height: number;
	public pos_x: number;
	public pos_y: number;
	public tear_delay: number;

	constructor(width: number, height: number, pos_x: number, pos_y: number) {
		super(width, height, pos_x, pos_y);
		this.sprite_filename = "assets/img/jays.png";
		this.speed = 2;
		this.tear_delay = 250;
	}

	public move_direction(direction) {
		super.move_direction(direction);

		const collision_warp = this.collision_warp();
		if (collision_warp.is_collision) {
			gameState.current_map = new Map(collision_warp.destination);
			// To change after warps improvement, see warp.js
			switch (direction) {
				case Direction.UP: this.pos_y = canvas_H - this.height - TILE_REF.height; break;
				case Direction.DOWN: this.pos_y = 0 + TILE_REF.height; break;
				case Direction.LEFT: this.pos_x = canvas_W - this.width - TILE_REF.height; break;
				case Direction.RIGHT: this.pos_x = 0 + TILE_REF.width; break;
			}
			gameState.tears = new Array<Tear>();
		}
	}
}