import { AudioFile } from "./audio_file";
import { static_canvas, renderer, gameState } from "./main";
import { IMessageBoxSettings, buildMessageBoxSettings } from "./imessage_box_configuration";

/**
 * TODO: Triggers, Next messages, Stop, Text scrolling, Storage
 */
export class MessageBox {
	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;

	public content: Array<string>;

	private settings: IMessageBoxSettings;

	public left: number;
	public top: number;
	public width: number;
	public height: number;

	public scrolling_index: number;
	public scrolling_text: string;
	public scrolling_line_index: number;

	constructor(
		content: Array<string>,
		boxSettings?: IMessageBoxSettings,
	) {
		this.content = content;

		this.settings = buildMessageBoxSettings(boxSettings);

		this.width = static_canvas.width / 2;
		this.height = static_canvas.height / 5;
		this.top = static_canvas.offsetTop + static_canvas.height - this.height - (static_canvas.height / 20);

		this.scrolling_index = 0;
		this.scrolling_text = "";
		this.scrolling_line_index = 0;
	}

	public start() {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d", { alpha: true });
		renderer.disableCanvasSmoothing(this.context);
		this.canvas.classList.add("messageBox");

		// Background
		this.canvas.style.background = this.settings.background;
		this.canvas.style.border =this.settings.border;

		// Position
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.position = "absolute";
		this.canvas.style.top = this.top + "px";
		
		// Font
		this.context.fillStyle = this.settings.fontColor;
		this.context.font = `${this.height / 6}px ${this.settings.fontFamily}`;

		document.getElementById("main-layers").appendChild(this.canvas);
		gameState.current_message = this;
	}

	public draw() {
		const text = this.content[0];
		const text_x = this.width / 60;
		const text_y = (1 + this.scrolling_line_index) * this.height / 4;
		const text_width = this.context.measureText(text).width + text_x;
		if (text_width > this.canvas.width) {
			const lines = this.split_text_canvas(text, this.context, text_x, this.canvas.width);
			if (this.scrolling_line_index < lines.length) {
				if (this.fill_scrolling_text(lines, text_x, text_y)) {
					++this.scrolling_line_index;
				}
			}
		}
		else {
			if (this.fill_scrolling_text(new Array<string>(text), text_x, text_y)) {
				++this.scrolling_line_index;
			}
		}
	}

	public fill_scrolling_text(lines: Array<string>, x: number, y: number): boolean {
		const timer = gameState.get_timer("textbox");
		timer.enable();
		if (this.scrolling_index < lines[this.scrolling_line_index].length) {
			if (timer.next_tick()) {
				this.context.save();
				this.context.clearRect(0, 0, this.width, this.height);
				for (let i = 0; i < this.scrolling_line_index; i++) {
					this.context.fillText(lines[i], x, (1 + i) * this.height / 4);
				}
				this.scrolling_text += lines[this.scrolling_line_index][this.scrolling_index];
				this.context.fillText(this.scrolling_text, x, y);
				new AudioFile(this.settings.soundPath).play();
				++this.scrolling_index;
				this.context.restore();
			}
		}
		else if (this.scrolling_index > 0) {
			this.scrolling_index = 0;
			this.scrolling_text = "";
			return true;
		}
		return false;
	}

	public split_text_canvas(text: string, context: CanvasRenderingContext2D, text_x: number, canvas_width: number): Array<string> {
		const words = text.split(" ");
		const lines = new Array<string>();
		let line = "";
		for (let i = 0; i < words.length; i++) {
			const space = line === "" ? "" : " ";
			const next_length = context.measureText(line + space + words[i]).width + text_x;
			if (next_length < canvas_width) {
				line += space + words[i];
			}
			else {
				lines.push(line);
				line = words[i];
			}
		}
		lines.push(line);
		return lines;
	}

}