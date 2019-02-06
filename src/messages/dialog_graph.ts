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

export interface IQuestionNode extends IDialogNode {
	answers: IDialogNode[];
}

export function get_animation(node: IDialogNode): DialogAnimation {
	return node.animation || DialogAnimation.None;
}

export const sample_dialog = <IDialogNode>{
	message: "Shrubberies are my trade. I am a shrubber.",
	next_node: <IDialogNode>{
		message: "My name is Roger the Shrubber. I arrange, design, and sell shrubberies.",
		animation: DialogAnimation.Shaky,
		next_node: <IQuestionNode>{
			message: "Are you saying Ni to that old woman?",
			answers: [
				{
					message: "Um, yes.",
					animation: DialogAnimation.None,
					next_node: <IDialogNode>{
						message: "Oh, what sad times are these when passing ruffians can say Ni at will to old ladies."
					}
				},
				{
					message: "Ni!",
					animation: DialogAnimation.Shaky,
					next_node: <IDialogNode>{
						message: "There is a pestilence upon this land, nothing is sacred. Even those who arrange and design shrubberies are under considerable economic stress in this period in history."
					}
				}
			]
		}
	}
};