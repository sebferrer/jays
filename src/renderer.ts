import { ctx, canvas, canvas_W, canvas_H, minimap_ctx } from "./main";
import { IDrawable } from "./idrawable";

export class Renderer {
	public zoomScale: number;
	public zoomScaleNext: Map<number, number>;

	constructor() {
		this.zoomScale = 1;
		this.zoomScaleNext = new Map<number, number>([[1, 1.25], [1.25, 1.5], [1.5, 1.75], [1.75, 2], [2, 1]]);
	}

	public disableSmoothing(): void {
		ctx.webkitImageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}

	public scale(zoomScale?: number): void {
		this.zoomScale = zoomScale == null ? this.zoomScaleNext.get(this.zoomScale) : zoomScale;
		canvas.width = canvas_W * this.zoomScale;
		canvas.height = canvas_H * this.zoomScale;
		ctx.scale(this.zoomScale, this.zoomScale);
		this.disableSmoothing();
	}

	public autoScale(): void {
		const ratio = Math.round(window.innerHeight / canvas_H * 100) / 100;
		canvas.width = canvas_W * ratio;
		canvas.height = canvas_H * ratio;
		ctx.scale(ratio, ratio);
		this.disableSmoothing();
	}

	public update_minimap(drawable: IDrawable): void {
		minimap_ctx.clearRect(0, 0, minimap_ctx.canvas.width, minimap_ctx.canvas.height);
		drawable.draw(minimap_ctx);
	}

	/** Draws a rectangle with a border radius */
	public stroke_round_rect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, ratio: number): void {
		this.make_round_rect_path(context, x, y, width, height, ratio);
		context.stroke();
	}

	/** Draws a rectangle with a border radius */
	public fill_round_rect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, ratio: number): void {
		this.make_round_rect_path(context, x, y, width, height, ratio);
		context.fill();
	}

	private make_round_rect_path(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, ratio: number): void {
		if (width < 2 * ratio) {
			ratio = width / 2;
		}
		if (height < 2 * ratio) {
			ratio = height / 2;
		}
		context.beginPath();
		context.moveTo(x + ratio, y);
		context.arcTo(x + width, y, x + width, y + height, ratio);
		context.arcTo(x + width, y + height, x, y + height, ratio);
		context.arcTo(x, y + height, x, y, ratio);
		context.arcTo(x, y, x + width, y, ratio);
		context.closePath();
	}
}

window.requestAnimationFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window["mozRequestAnimationFrame"] ||
		window["oRequestAnimationFrame"] ||
		window["msRequestAnimationFrame"] ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();