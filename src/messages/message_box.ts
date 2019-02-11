import { AudioFile } from "../audio_file";
import { gameState, renderer, static_canvas } from "../main";
import { Timer } from "../timer";
import { DialogGraph, IDialogNode, DialogAnimation, IQuestionNode as IQuestionNode, get_animation, get_animation_factor } from "./dialog_graph";
import { buildMessageBoxSettings, IMessageBoxSettings } from "./imessage_box_configuration";
import { MathUtil } from "../util";
import { Direction } from "../enum";

/**
 * TODO: Triggers, Next messages, Stop, Text scrolling, Storage
 */
export class MessageBox {
	/** Bottom margin, so that the text is not stuck to the bottom of the message box */
	private static readonly _bottom_margin = 20;
	private static readonly DOM_ID = "message-box";

	/** Characters which shouldn't make any sound */
	private static readonly _silentCharacters = new Set([" ", ".", ",", ";"]);

	private _canvas: HTMLCanvasElement;
	private _context: CanvasRenderingContext2D;

	private _audio: AudioFile;

	private _settings: IMessageBoxSettings;

	private _timer: Timer;

	private _width: number;
	private _height: number;

	private _content: DialogGraph;
	private _current_node: IDialogNode;
	private _lines: string[];
	private _current_character_index: number;
	private _current_line_index: number;
	private _selected_choice_index: number;

	private _line_spacing: number;
	private _character_spacing: number;

	private _choice_sound: AudioFile;

	// Helpers
	private get _current_line(): string { return this._lines[this._current_line_index]; }
	private get _current_char(): string { return this._current_line[this._current_character_index]; }

	/** Returns true if the current message has been displayed entirely, false otherwise */
	private get _message_has_ended(): boolean { return this._current_line_index === this._lines.length - 1 && this._current_character_index === this._current_line.length - 1; }

	/** Returns the current node if it is a choice node, null otherwise */
	private get _current_question_node(): IQuestionNode {
		return (<IQuestionNode>this._current_node).answers != null && (<IQuestionNode>this._current_node).answers.length > 0 ? <IQuestionNode>this._current_node : null;
	}

	private get_character_x_offset = (line: string, character_index: number): number => this._context.measureText(line.substring(0, character_index)).width * (1 + this._character_spacing);

	private get_character_y_offset = (line_index: number): number => (1 + line_index) * parseInt(this._context.font) * (1 + this._line_spacing);


	constructor(content: DialogGraph, boxSettings?: IMessageBoxSettings) {
		this._content = content;

		this._settings = buildMessageBoxSettings(boxSettings);

		this._width = static_canvas.width;
		this._height = static_canvas.height / 4;

		this._line_spacing = 0.4;
		this._character_spacing = 0;

		this._current_character_index = 0;
		this._current_line_index = 0;
	}

	public start() {
		this._canvas = document.createElement("canvas");
		this._context = this._canvas.getContext("2d", { alpha: true });
		renderer.disableCanvasSmoothing(this._context);
		this._canvas.id = MessageBox.DOM_ID;

		this._audio = new AudioFile(this._settings.soundPath);
		this._choice_sound = new AudioFile("assets/sounds/sfx/pop.wav");

		// Background
		this._canvas.style.background = this._settings.background;
		this._canvas.style.border = this._settings.border;

		// Position
		this._canvas.width = this._width;
		this._canvas.height = this._height + MessageBox._bottom_margin;

		// Font
		this._context.fillStyle = this._settings.fontColor;
		this._context.font = `${this._height / 6}px ${this._settings.fontFamily}`;

		// Timer (important: init timer before loading the node)
		this._timer = gameState.get_timer("textbox");
		this._timer.enable();

		this.load_node(this._content.first_node);

		document.getElementById("main-layers").appendChild(this._canvas);
		gameState.current_message = this;
		gameState.pause();
	}

	public draw() {
		if (!this._timer.next_tick()) {
			return;
		}

		switch (get_animation(this._current_node)) {
			case DialogAnimation.None:
				// Draw current character
				this._context.fillText(this._current_char, this.get_character_x_offset(this._current_line, this._current_character_index), this.get_character_y_offset(this._current_line_index));
				break;
			case DialogAnimation.Shaky:
				this._context.save();
				this._context.clearRect(0, 0, this._width, this._height + MessageBox._bottom_margin);

				for (let line_index = 0; line_index <= this._current_line_index; ++line_index) {
					for (
						let character_index = 0;
						character_index < (line_index === this._current_line_index ? this._current_character_index + 1 : this._lines[line_index].length);
						++character_index
					) {
						const char = this._lines[line_index][character_index];
						this._context.fillText(
							char,
							this.get_character_x_offset(this._lines[line_index], character_index) + MathUtil.get_random_int(get_animation_factor(this._current_node)),
							this.get_character_y_offset(line_index) + MathUtil.get_random_int(get_animation_factor(this._current_node))
						);
					}
				}

				this._context.restore();
				break;
		}

		if (this._current_character_index + 1 < this._current_line.length) {
			++this._current_character_index;
			// Only play sound if character is not silent, and if there are new characters to display
			if (!MessageBox._silentCharacters.has(this._current_char)) {
				this._audio.play();
			}
		} else {
			this.handle_choices();
			if (this._current_line_index < this._lines.length - 1) {
				this._current_character_index = 0;
				++this._current_line_index;
			}
		}
	}

	/**
	 * Handle the case where the current node is a question node (displays the choices).
	 */
	private handle_choices(): void {
		// Not a question node, do nothing
		if (this._current_question_node == null) {
			return;
		}

		this._context.save();
		this._context.clearRect(0, this.get_character_y_offset(this._current_line_index) * 1.2, this._width, this._height + MessageBox._bottom_margin);
		this._context.restore();

		if (this._selected_choice_index == null) {
			this._selected_choice_index = 0;
		}

		for (let i = 0; i < this._current_question_node.answers.length; ++i) {
			const current_choice = this._current_question_node.answers[i];
			const text = i === this._selected_choice_index ? `> ${current_choice.message}` : current_choice.message;

			switch (get_animation(current_choice)) {
				case DialogAnimation.None:
					this._context.fillText(text, this.get_character_x_offset(text, 0), this.get_character_y_offset(i + 1 + this._current_line_index));
					break;
				case DialogAnimation.Shaky:
					for (let character_index = 0; character_index < text.length; ++character_index) {
						this._context.fillText(
							text[character_index],
							this.get_character_x_offset(text, character_index) + MathUtil.get_random_int(get_animation_factor(current_choice)),
							this.get_character_y_offset(i + 1 + this._current_line_index) + MathUtil.get_random_int(get_animation_factor(current_choice))
						);
					}
					break;
			}
		}
	}

	/**
	 * Prepares the MessageBox to display the given node
	 */
	private load_node(node: IDialogNode) {
		this._current_node = node;
		this._lines = this.split_text_canvas(this._current_node.message);
		this._current_line_index = 0;
		this._current_character_index = 0;
		this._timer.interval = 50;
		this._selected_choice_index = null;

		this._context.save();
		this._context.clearRect(0, 0, this._width, this._height + MessageBox._bottom_margin);
		this._context.restore();
	}

	/**
	 * Called when the action button is pressed (SpaceBar).
	 */
	public on_action_button(): void {

		if (this._message_has_ended) {

			// Execute action linked to the node if any
			if (this._current_node.action != null) {
				this._current_node.action();
			}

			if (this._current_question_node != null) {
				// Load choice
				this.load_node(this._current_question_node.answers[this._selected_choice_index].next_node);
			} else if (this._current_node.next_node == null) {
				// Close message box
				document.getElementById(MessageBox.DOM_ID).remove();
				gameState.current_message = null;
				gameState.resume();
			} else {
				// Load next node
				this.load_node(this._current_node.next_node);
			}
		} else {
			// Speed up the message
			this._timer.interval = 5;
		}
	}

	/**
	 * Called when a choice button is pressed.
	 * @param direction the direction of the choice button
	 */
	public on_choice_button(direction: Direction): void {
		if (this._current_question_node == null) {
			return;
		}

		switch (direction) {
			case Direction.UP:
				if (this._selected_choice_index > 0) {
					--this._selected_choice_index;
					this._choice_sound.play();
				}
				break;
			case Direction.DOWN:
				if (this._selected_choice_index < this._current_question_node.answers.length - 1) {
					++this._selected_choice_index;
					this._choice_sound.play();
				}
				break;
		}
	}

	private split_text_canvas(text: string): Array<string> {
		const words = text.split(" ");
		const lines = new Array<string>();
		let line = words[0];
		for (let i = 1; i < words.length; i++) {
			const space = line === "" ? "" : " ";
			const next_length = this._context.measureText(line + space + words[i]).width * (1 + this._character_spacing);
			if (next_length <= this._width) {
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
