export interface IMessageBoxSettings {
	fontFamily?: string;
	fontColor?: string;
	background?: string;
	border?: string;
	soundPath?: string;
}

export const DEFAULT_MESSAGE_BOX_SETTINGS: IMessageBoxSettings = {
	fontFamily: "Monospace",
	fontColor: "white",
	background: "black",
	border: "1px solid white",
	soundPath: "assets/sounds/sfx/msg_1.wav"
};

export function buildMessageBoxSettings(settings: IMessageBoxSettings): IMessageBoxSettings {
	if (settings == null) {
		settings = {};
	}

	return <IMessageBoxSettings>{
		fontFamily: settings.fontFamily || DEFAULT_MESSAGE_BOX_SETTINGS.fontFamily,
		fontColor: settings.fontColor || DEFAULT_MESSAGE_BOX_SETTINGS.fontColor,
		background: settings.background || DEFAULT_MESSAGE_BOX_SETTINGS.background,
		border: settings.border || DEFAULT_MESSAGE_BOX_SETTINGS.border,
		soundPath: settings.soundPath || DEFAULT_MESSAGE_BOX_SETTINGS.soundPath
	};
}