import { Direction } from "../enum";
import { Point } from "../point";
import { WallSprite } from "./wall_sprite";
import { canvas_H, canvas_W, bank } from "../main";
import { IDrawable } from "../idrawable";

export abstract class WallElement implements IDrawable {
	private _direction: Direction;
	public get direction(): Direction { return this._direction; }

	private _sprite: WallSprite;
	public get sprite(): WallSprite { return this._sprite; }

	private _position: Point;
	/** Position of the top left corner of the element on the canvas */
	public get position(): Point { return this._position; }

	private _width: number;
	public get width(): number { return this._width; }

	private _height: number;
	public get height(): number { return this._height; }

	private _rotation_angle: number;

	constructor(
		direction: Direction,
		sprite: WallSprite,
		position: Point = null,
		width: number = null,
		height: number = null
	) {
		this._direction = direction;
		this._sprite = sprite;
		this._position = position == null ? this.get_position(direction, sprite) : position;
		this._rotation_angle = this.get_rotation(direction);
		this._width = width == null ? sprite.width : width;
		this._height = height == null ? sprite.height : height;
	}

	protected abstract get_position(direction: Direction, sprite: WallSprite): Point;

	/** Returns the rotation necessary to draw the element correctly */
	public get_rotation(direction: Direction) {
		switch (direction) {
			case Direction.UP: return 0;
			case Direction.DOWN: return -180;
			case Direction.LEFT: return -90;
			case Direction.RIGHT: return 90;
			default: throw new Error(`Unknown direction '${direction}'`);
		}
	}

	public draw(ctx: CanvasRenderingContext2D): void {

		const picture = bank.pic[this.sprite.sprite_sheet_path];

		// If the width/height of the element is different than the sprite's,
		// it means the element is repeatable
		if (this.width !== this.sprite.width) {
			const repetitions = this.width / this.sprite.width;
			for (let i = 0; i < repetitions; ++i) {
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
			for (let i = 0; i < repetitions; ++i) {
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


		// Otherwise, draw a single image
		ctx.save();
		this.sprite.rotate(ctx, this.position, this._rotation_angle);
		ctx.drawImage(picture,
			this.sprite.top_left.x, this.sprite.top_left.y,
			this.sprite.width, this.sprite.height,
			this.position.x, this.position.y,
			this.sprite.width, this.sprite.height);
		ctx.restore();
	}
}