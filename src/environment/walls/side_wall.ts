import { WallElement } from "./wall_element";
import { WallSprite } from "./wall_sprite";
import { Direction } from "../../enum";
import { canvas_H, canvas_W, bank } from "../../main";
import { Point } from "../../point";

/** Represents a whole portion of a wall */
export class SideWall extends WallElement {
	constructor(direction: Direction, sprite: WallSprite) {
		let dimensions: { width: number, height: number };
		switch (direction) {
			case Direction.UP:
			case Direction.DOWN:
				// the sides could be removed, but idgaf
				dimensions = { width: canvas_W - 2 * sprite.width, height: sprite.height };
				break;
			case Direction.LEFT:
			case Direction.RIGHT:
				dimensions = { width: sprite.width, height: canvas_H - 2 * sprite.height };
				break;
		}
		super(direction, sprite, null, dimensions.width, dimensions.height);
	}

	protected get_position(direction: Direction, sprite: WallSprite): Point {
		switch (direction) {
			case Direction.UP: return new Point(sprite.width, 0);
			case Direction.DOWN: return new Point(sprite.width, canvas_H - sprite.height);
			case Direction.LEFT: return new Point(0, sprite.height);
			case Direction.RIGHT: return new Point(canvas_W - sprite.width, sprite.height);
			default: throw new Error(`Unknown or invalid direction '${direction}'`);
		}
	}

	public draw(ctx: CanvasRenderingContext2D): void {

		const picture = bank.pic[this.sprite.sprite_sheet_path];


		// Small variation of what base.draw() does: ignore the corner
		if (this.width !== this.sprite.width) {
			const repetitions = this.width / this.sprite.width;
			for (let i = 1; i <= repetitions; ++i) {
				ctx.save();

				const destination = new Point(i * this.sprite.width, this.position.y);
				this.sprite.rotate(ctx, destination, this._rotation_angle);

				ctx.drawImage(picture,
					this.sprite.top_left.x, this.sprite.top_left.y,
					this.sprite.width, this.sprite.height,
					destination.x, destination.y,
					this.sprite.width, this.sprite.height
				);

				ctx.restore();
			}
			return;
		} else if (this.height !== this.sprite.height) {
			const repetitions = this.height / this.sprite.height;
			for (let i = 1; i <= repetitions; ++i) {
				ctx.save();

				const destination = new Point(this.position.x, i * this.sprite.height);
				this.sprite.rotate(ctx, destination, this._rotation_angle);

				ctx.drawImage(picture,
					this.sprite.top_left.x, this.sprite.top_left.y,
					this.sprite.width, this.sprite.height,
					destination.x, destination.y,
					this.sprite.width, this.sprite.height
				);

				ctx.restore();
			}
			return;
		}
		throw new Error("Side walls must be repeatable");
	}
}