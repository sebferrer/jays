import { IDrawable } from "./idrawable";
import { canvas_H, canvas_W, main_layers, minimap_ctx, static_ctx } from "./main";

export class Renderer {
	public zoomScale: number;
	public zoomScaleNext: Map<number, number>;

	constructor() {
		this.zoomScale = 1;
		this.zoomScaleNext = new Map<number, number>([[1, 1.25], [1.25, 1.5], [1.5, 1.75], [1.75, 2], [2, 1]]);
	}

	public disableSmoothing(): void {
		main_layers.forEach(layer => {
			this.disableCanvasSmoothing(layer.ctx);
		});
	}

	public disableCanvasSmoothing(context: CanvasRenderingContext2D): void {
		context["webkitImageSmoothingEnabled"] = false;
		context["mozImageSmoothingEnabled"] = false;
		context.imageSmoothingEnabled = false;
	}

	public scale(zoomScale?: number): void {
		this.zoomScale = zoomScale == null ? this.zoomScaleNext.get(this.zoomScale) : zoomScale;
		main_layers.forEach(layer => {
			layer.canvas.width = canvas_W * this.zoomScale;
			layer.canvas.height = canvas_H * this.zoomScale;
			layer.ctx.scale(this.zoomScale, this.zoomScale);
		});
		this.disableSmoothing();
	}

	public autoScale(): void {
		this.scale(Math.round(window.innerHeight / canvas_H * 100) / 100);
	}

	public update_minimap(mini_map: IDrawable): void {
		minimap_ctx.save();
		minimap_ctx.clearRect(0, 0, minimap_ctx.canvas.width, minimap_ctx.canvas.height);
		mini_map.draw(minimap_ctx);
		minimap_ctx.restore();
	}

	public update_current_room(current_room: IDrawable): void {
		static_ctx.save();
		static_ctx.clearRect(0, 0, canvas_W, canvas_H);
		current_room.draw(static_ctx);
		static_ctx.restore();
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