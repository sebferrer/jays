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
	Shaky = 1,
	Glitchy_Spinny = 2,
	Glitchy_Splitted = 3,
	Glitchy_Uppercase = 4
}

export interface IDialogAnimation {
	type: DialogAnimation;
	factor?: number;
}

export interface IDialogNode {
	message: string;
	animation?: IDialogAnimation;
	next_node?: IDialogNode;
	action?: () => void;
}

export interface IQuestionNode extends IDialogNode {
	answers: IDialogNode[];
}

export function get_animation(node: IDialogNode): DialogAnimation {
	return node.animation != null ? node.animation.type : DialogAnimation.None;
}

export function get_animation_factor(node: IDialogNode): number {
	return node.animation != null && node.animation.factor != null ? node.animation.factor : 0;
}

export const sample_dialog = <IDialogNode>{
	message: "Shrubberies are my trade. I am a shrubber.",
	next_node: <IDialogNode>{
		message: "My name is Roger the Shrubber. I arrange, design, and sell shrubberies.",
		animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 4 },
		next_node: <IQuestionNode>{
			message: "Are you saying Ni to that old woman?",
			answers: [
				{
					message: "Um, yes.",
					animation: <IDialogAnimation>{ type: DialogAnimation.None },
					next_node: <IDialogNode>{
						message: "Oh, what sad times are these when passing ruffians can say Ni at will to old ladies."
					}
				},
				{
					message: "Ni!",
					animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 4 },
					next_node: <IDialogNode>{
						message: "There is a pestilence upon this land, nothing is sacred. Even those who arrange and design shrubberies are under considerable economic stress in this period in history."
					}
				}
			]
		}
	}
};

export const first_sign = <IDialogNode>{
	message: "after 2 years of abandonment, Jays development is back.",
	next_node: <IDialogNode>{
		message: "Brace yourself.",
		animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 4 },
	}
};

export const angry_dialog = <IDialogNode>{
	message: "Hello there! How are you? ^_^",
	next_node: <IDialogNode>{
		message: "Why don't you answer me...?",
		animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 2 },
		next_node: <IDialogNode>{
			message: "Please stop ignoring me...",
			animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 4 },
			next_node: <IDialogNode>{
				message: "Don't you think I've already suffered enough? Do you even know what I've been through until now?",
				animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 6 },
				next_node: <IDialogNode>{
					message: "Oh sure! Keep not answering! After all, you're smarter than everyone! You're above EVERYTHING",
					animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 8 },
					next_node: <IDialogNode>{
						message: "HEY, I'M TALKING TO YOU, YOU BRAT",
						animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 10 },
						next_node: <IDialogNode>{
							message: "I'm so angry that my text starts to shakea bit too much right now...",
							animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 15 },
							next_node: <IDialogNode>{
								message: "But after all, you're right... In this world. it's kill or to be killed.",
								animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 20 },
								next_node: <IDialogNode>{
									message: "Anyway, stop playing Cloud at Smash Bros, you fucking noob!",
									animation: <IDialogAnimation>{ type: DialogAnimation.Shaky, factor: 100 }
								}
							}
						}
					}
				}
			}
		}
	}
};

export const glitchy_dialog = <IDialogNode>{
	message: "[GLITCHY_SPINNY] Hi There. I'm an Hey-Aye the AI. I'm not a bad guy. But I'm not nice either. To be honest, I don't care. Die.",
	animation: <IDialogAnimation>{ type: DialogAnimation.Glitchy_Spinny },
	next_node: <IDialogNode>{
		message: "[GLITCHY_SPLITTED] Hi There. I'm an Hey-Aye the AI. I'm not a bad guy. But I'm not nice either. To be honest, I don't care. Die.",
		animation: <IDialogAnimation>{ type: DialogAnimation.Glitchy_Splitted, factor: 25 },
		next_node: <IDialogNode>{
			message: "[GLITCHY_UPPERCASE] Hi There. I'm an Hey-Aye the AI. I'm not a bad guy. But I'm not nice either. To be honest, I don't care. Die.",
			animation: <IDialogAnimation>{ type: DialogAnimation.Glitchy_Uppercase },
		}
	}
};