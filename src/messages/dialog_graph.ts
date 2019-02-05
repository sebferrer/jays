export class DialogGraph {
	private _character: string;
	public get character(): string { return this._character; }

	private _first_node: IDialogNode;
	public get first_node(): IDialogNode { return this._first_node; }

	constructor(character: string, first_node: IDialogNode) {
		this._character = character;
		this._first_node = first_node;
	}
}

export enum DialogAnimation {
	None = 0,
	Shaky = 1
}

export interface IDialogNode {
	message: string;
	animation?: DialogAnimation;
	next_node?: IDialogNode;
	action?: () => void;
}

export interface IChoiceNode extends IDialogNode {
	choices: IDialogNode[];
}

// I like to get up early to smell the morning fresh air. This is a long ass message just to check how the message box reacts to it, don't mind me. Bla bla bla bla, lorem ipsum lol. I like to get up early to smell the morning fresh air. This is a long ass message just to check how the message box reacts to it, don't mind me. Bla bla bla bla, lorem ipsum lol.

export const sample_dialog = <IDialogNode>{
	message: "I like to get up early to smell the morning fresh air. This is a long ass message just to check how the message box reacts to it, don't mind me. Bla bla bla bla, lorem ipsum lol. I like to get up early to smell the morning fresh air. This is a long ass message just to check how the message box reacts to it, don't mind me. Bla bla bla bla, lorem ipsum lol.",
	next_node: <IDialogNode>{
		message: "I like the smell of grass in the early morning.",
		next_node: <IChoiceNode>{
			message: "Wouldn't you like to hear my tale, kind sir?",
			choices: [
				{
					message: "Yes mate",
					next_node: <IDialogNode>{
						message: "Oh look at the time, I've got to go feed my ducks. A fine day to you sir!"
					}
				},
				{
					message: "Back off you weirdo",
					next_node: <IDialogNode>{
						message: "Well, a fine day to you sir."
					}
				}
			]
		}
	}
}