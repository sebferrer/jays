import { ctx, canvas, canvas_W, canvas_H } from "./main";

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