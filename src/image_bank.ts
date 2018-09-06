import { GameState } from "./gamestate";

export class ImageBank {

	public buffer: any;
	public pic: any;
	public error: number;
	public unload: number;
	public loaded: number;
	public nextLoad: number;
	public list: Array<string>;

	constructor() {
		this.buffer = new Array();
		this.pic = new Object();
		this.error = 0;
		this.unload = 0;
		this.loaded = 0;
		this.nextLoad = 0;
		this.list = ["assets/img/tiles.png", "assets/img/jays.png", "assets/img/tear.png", "assets/img/walls/floor_one.png"];
	}

	public preload(gameState: GameState): void {
		this.unload = this.list.length;
		this.error = 0;
		this.loaded = 0;
		this.nextLoad = 0;
		this.buffer = this.list;

		const self = this;
		const timer = function () {
			if (self.loaded === self.unload) {
				gameState.update();
			}
			else if (self.loaded > self.nextLoad) {
				self.nextLoad++;
				self.load_img();
				setTimeout(timer, 10);
			}
			else {
				setTimeout(timer, 10);
			}
		};
		this.load_img();
		setTimeout(timer, 10);
	}

	public load_img(): void {
		const ref = this.buffer[this.nextLoad];
		const img = new Image();
		img.src = ref;
		const self = this;

		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.height = img.height;
			canvas.width = img.width;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			self.pic[ref] = canvas;
			self.loaded++;
		};

		img.onerror = () => {
			self.loaded++;
			self.error++;
		};
	}
}