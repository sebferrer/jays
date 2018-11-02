import { AudioFile } from "./audio_file";
import { static_canvas, renderer } from "./main";

/**
 * TODO: Triggers, Next messages, Stop, Text scrolling, Storage
 */
export class MessageBox {
	public canvas: HTMLCanvasElement;
	public context: CanvasRenderingContext2D;
	public character: string | null;
	public characterFont: string;
	public content: Array<string>;
	public sound: AudioFile;
	public font: string;
	public fontColor: string;
	public backgroundColor: string;
	public borderColor: string;
	public left: number;
	public top: number;
	public width: number;
	public height: number;

	constructor(content: Array<string>, character?: string, characterFont?: string,
		sound?: AudioFile, font?: string, fontColor?: string,
		backgroundColor?: string, borderColor?: string) {
		this.content = content;
		this.character = character;
		this.characterFont = characterFont == null ? "5px 'Arial'" : characterFont;
		this.sound = sound == null ? new AudioFile("assets/sounds/sfx/msg_1.wav") : sound;
		this.fontColor = fontColor == null ? "white" : fontColor;
		this.backgroundColor = backgroundColor == null ? "black" : backgroundColor;
		this.borderColor = borderColor == null ? "black" : backgroundColor;
		this.width = static_canvas.width / 2;
		this.height = static_canvas.height / 5;
		this.top = static_canvas.offsetTop + static_canvas.height - this.height - (static_canvas.height / 20);
		this.font = font == null ? (this.height / 6) + "px 'Comic Sans MS'" : font;
	}

	public start() {
		this.canvas = document.createElement("canvas");
		this.context = this.canvas.getContext("2d", { alpha: true });
		renderer.disableCanvasSmoothing(this.context);
		this.canvas.classList.add("messageBox");
		this.canvas.style.backgroundColor = this.backgroundColor;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.position = "absolute";
		this.canvas.style.top = this.top + "px";
		this.context.font = this.font;
		this.context.fillStyle = this.fontColor;

		this.display_text(this.content[0]);

		document.getElementById("main-layers").appendChild(this.canvas);
	}

	public display_text(text) {
		const text_x = this.width / 60;
		let text_y = this.height / 4;
		const text_width = this.context.measureText(text).width + text_x;
		if (text_width > this.canvas.width) {
			const lines = this.split_text_canvas(text, this.context, text_x, this.canvas.width);
			for (let i = 0; i < lines.length; i++) {
				this.context.fillText(lines[i], text_x, text_y);
				text_y += (this.height / 4);
			}
		}
		else {
			this.context.fillText(text, text_x, text_y);
		}
	}

	public split_text_canvas(text, context, text_x, canvas_width): Array<string> {
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