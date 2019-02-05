import { AudioFile } from "../audio_file";
import { gameState, renderer, static_canvas } from "../main";
import { Timer } from "../timer";
import { DialogGraph, IDialogNode } from "./dialog_graph";
import { buildMessageBoxSettings, IMessageBoxSettings } from "./imessage_box_configuration";

/**
 * TODO: Triggers, Next messages, Stop, Text scrolling, Storage
 */
export class MessageBox {
	protected _canvas: HTMLCanvasElement;
	protected _context: CanvasRenderingContext2D;

	protected _audio: AudioFile;

	protected _settings: IMessageBoxSettings;

	protected _timer: Timer;
	public get timer(): Timer { return this._timer; }

	protected _width: number;
	protected _height: number;

	protected _content: DialogGraph;
	protected _current_node: IDialogNode;
	protected _lines: string[];
	protected _current_character_index: number;
	protected _current_line_index: number;
	protected get _current_line(): string { return this._lines[this._current_line_index]; }
	protected get _current_char(): string { return this._current_line[this._current_character_index]; }

	/** Number of characters per line */
	protected static readonly _line_width_in_characters = 50;

	/** Characters which shouldn't make any sound */
	protected static readonly _silentCharacters = new Set([
		" ", ".", ",", ";"
	]);

	constructor(content: DialogGraph, boxSettings?: IMessageBoxSettings) {
		this._content = content;

		this._settings = buildMessageBoxSettings(boxSettings);

		this._width = static_canvas.width;
		this._height = static_canvas.height / 4;

		this._current_character_index = 0;
		this._current_line_index = 0;
	}

	public start() {
		this._canvas = document.createElement("canvas");
		this._context = this._canvas.getContext("2d", { alpha: true });
		renderer.disableCanvasSmoothing(this._context);
		this._canvas.classList.add("message-box");

		this._audio = new AudioFile(this._settings.soundPath);

		// Background
		this._canvas.style.background = this._settings.background;
		this._canvas.style.border = this._settings.border;

		// Position
		this._canvas.width = this._width;
		this._canvas.height = this._height + 25;

		// Font
		this._context.fillStyle = this._settings.fontColor;
		this._context.font = `${this._height / 6}px ${this._settings.fontFamily}`;

		// Lines
		this._current_node = this._content.first_node;
		this._lines = this.split_text_canvas(this._current_node.message);
		this._current_line_index = 0;
		this._current_character_index = 0;

		// Timer
		this._timer = gameState.get_timer("textbox");
		this._timer.enable();

		document.getElementById("main-layers").appendChild(this._canvas);
		gameState.current_message = this;
	}

	public draw() {
		if (this._current_line_index >= this._lines.length) {
			return;
		}
		this.draw_next_char();

		// If line has ended, start drawing the next one
		if (this._current_character_index >= this._current_line.length) {
			++this._current_line_index;
			this._current_character_index = 0;
		}
	}

	protected get_character_x_offset = (character_index: number): number => character_index * (this._width / MessageBox._line_width_in_characters);

	protected get_character_y_offset = (line_index: number): number => (1 + line_index) * this._height / 4;

	protected draw_next_char() {
		if (!this._timer.next_tick()) {
			return;
		}

		// Draw current character
		this._context.fillText(this._current_char, this.get_character_x_offset(this._current_character_index), this.get_character_y_offset(this._current_line_index));

		// Only play sound if character is not silent
		if (!MessageBox._silentCharacters.has(this._current_char)) {
			this._audio.play();
		}

		++this._current_character_index;
	}

	protected split_text_canvas(text: string): Array<string> {
		const words = text.split(" ");
		const lines = new Array<string>();
		let line = words[0];
		for (let i = 1; i < words.length; i++) {
			if (line.length + words[i].length <= MessageBox._line_width_in_characters) {
				line += ` ${words[i]}`;
			} else {
				lines.push(line);
				line = words[i];
			}
		}
		lines.push(line);
		return lines;
	}
}
