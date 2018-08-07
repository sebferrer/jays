import { GameState } from "./gamestate";

export class ImgBank {

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
		this.list = ["assets/img/tiles.png", "assets/img/jays.png", "assets/img/tear.png"];
	}

	public preload(gameState: GameState): void {
		this.unload = this.list.length;
		this.error = 0;
		this.loaded = 0;
		this.nextLoad = 0;
		this.buffer = this.list;

		var self = this;
		var timer = function () {
			if (self.loaded == self.unload) {
				gameState.update();
			}
			else if (self.loaded > self.nextLoad) {
				self.nextLoad++;
				self.loadimg();
				setTimeout(timer, 10);
			}
			else {
				setTimeout(timer, 10);
			}
		}
		this.loadimg();
		setTimeout(timer, 10);
	}

	public loadimg(): void {
		var ref = this.buffer[this.nextLoad];
		var img = new Image();
		img.src = ref;
		var self = this;

		img.onload = function () {
			var canvas = document.createElement("canvas");
			canvas.height = img.height;
			canvas.width = img.width;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0);

			self.pic[ref] = canvas;
			self.loaded++;
		};

		img.onerror = function () {
			self.loaded++;
			self.error++;
		};
	}
}