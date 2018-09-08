import { Point } from "../point";

export class WallSprite {

	protected _top_left: Point;
	public get top_left(): Point { return this._top_left; }

	protected _bottom_right: Point;
	public get bottom_right(): Point { return this._bottom_right; }

	protected _sprite_sheet_path: string;
	public get sprite_sheet_path(): string { return this._sprite_sheet_path; }

	public get width(): number { return this.bottom_right.x - this.top_left.x; }
	public get height(): number { return this.bottom_right.y - this.top_left.y; }

	constructor(top_left: Point, bottom_right: Point, sprite_sheet_path: string) {
		if (top_left == null) {
			throw new Error("Parameter 'top_left' cannot be null");
		}
		if (bottom_right == null) {
			throw new Error("Parameter 'bottom_right' cannot be null");
		}
		if (sprite_sheet_path == null) {
			throw new Error("Parameter 'sprite_sheet_path' cannot be null");
		}
		this._top_left = top_left;
		this._bottom_right = bottom_right;
		this._sprite_sheet_path = sprite_sheet_path;
	}

	/**
	 * Returns the center of the sprite relative to its position in the canvas
	 * @param destX the abscissa of the top left corner of the sprite in the canvas
	 * @param destY the ordinate of the top left corner of the sprite in the canvas
	 */
	public getCenter(destX: number, destY: number): Point {
		return new Point(destX + this.width / 2, destY + this.height / 2);
	}

	/**
	 * 
	 * @param ctx rendering context
	 * @param dest the coordinates of the top left corner of the sprite in the canvas
	 * @param angleInDegrees angle
	 */
	public rotate(ctx: CanvasRenderingContext2D, dest: Point, angleInDegrees: number): void {

		const center = this.getCenter(dest.x, dest.y);

		ctx.translate(center.x, center.y);
		ctx.rotate(WallSprite.getRadians(angleInDegrees));
		ctx.translate(- center.x, - center.y);
	}

	public static getRadians(angleInDegrees: number) {
		return angleInDegrees * Math.PI / 180;
	}

}