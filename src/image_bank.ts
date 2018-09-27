export class ImageBank {

	public buffer: any;
	public pictures: { [key: string]: HTMLCanvasElement };
	public unload: number;

	private _loaded: boolean;
	public get loaded(): boolean { return this._loaded; }

	public list: string[] = [
		"assets/img/tiles.png",
		"assets/img/jays.png",
		"assets/img/tear.png",
		"assets/img/walls/floor_one.png",
		"assets/img/minimap_icons.png"
	];

	constructor() {
		this.buffer = new Array();
		this.pictures = {};
		this._loaded = false;
	}

	public load_images(): Promise<void> {
		// Already loaded, do nothing
		if (this._loaded) {
			return Promise.resolve();
		}
		return Promise.all(this.list.map(path =>
			new Promise<HTMLImageElement>((resolve, reject) => {
				const image = new Image();
				image.addEventListener("load", e => {
					const canvas = document.createElement("canvas");
					canvas.height = image.height;
					canvas.width = image.width;
					const context = canvas.getContext("2d");
					context.drawImage(image, 0, 0);

					this.pictures[path] = canvas;
					resolve();
				});
				image.addEventListener("error", e => reject(new Error(`Failed to load image '${path}'`)));
				image.src = path;
			})
		)).then(() => {
			this._loaded = true;
		});
	}
}