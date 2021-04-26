import { IPositionable } from "./environment/positions_accessor";
import { Point } from "./point";
import { Sprite } from "./sprite";
import { IDrawable } from "./idrawable";
import { Entity } from "./entity";
import { IMAGE_BANK } from "./main";

export abstract class DrawableEntity extends Entity implements IPositionable, IDrawable {

	constructor(id: string, current_sprite: Sprite, pos: Point, width: number, height: number,
		has_collision_objects?: boolean, height_perspective?: number, floor_level?: number, room_number?: number) {

		super(id, current_sprite, pos, width, height, has_collision_objects, height_perspective, floor_level, room_number);
	}

	public draw(ctx: CanvasRenderingContext2D): void {
		ctx.drawImage(IMAGE_BANK.pictures[this.sprite_filename],
			this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
			this.position.x, this.position.y, this.width, this.height);
	}
}