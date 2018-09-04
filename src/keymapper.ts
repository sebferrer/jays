import { KeyboardType, Direction } from "./enum";

export class KeyMapper {

	private static readonly DEFAULT_KEYBOARD_TYPE = KeyboardType.AZERTY;

	private _innerDictionary = new Map<KeyboardType, Map<string[1], Direction>>();

	public get available_keyboard_types(): KeyboardType[] {
		return Array.from(this._innerDictionary.keys());
	}

	private _current_keyboard_type: KeyboardType = KeyMapper.DEFAULT_KEYBOARD_TYPE;
	public get current_keyboard_type(): KeyboardType { return this._current_keyboard_type; }
	public set current_keyboard_type(value: KeyboardType) {
		if(value == null) {
			throw new Error("current_keyboard_type cannot be null or undefined");
		}
		this._current_keyboard_type = value;
	}

	public get current_keyboard(): Map<string[1], Direction> {
		return this._innerDictionary.get(this._current_keyboard_type);
	}

	constructor(keyboard_type?: KeyboardType) {
		// Azerty 
		this.addKeyboard(KeyboardType.AZERTY,
			{
				"z": Direction.UP,
				"q": Direction.LEFT,
				"s": Direction.DOWN,
				"d": Direction.RIGHT
			});
		// Qwerty
		this.addKeyboard(KeyboardType.QWERTY,
			{
				"w": Direction.UP,
				"a": Direction.LEFT,
				"s": Direction.DOWN,
				"d": Direction.RIGHT
			});
		this._current_keyboard_type = keyboard_type != null ? keyboard_type : KeyMapper.DEFAULT_KEYBOARD_TYPE;
	}

	private addKeyboard(type: KeyboardType, keys: { [key: string]: Direction }): void {
		if (this._innerDictionary.get(type) != null) {
			throw new Error("Keyboard already exists");
		}
		this._innerDictionary.set(type, new Map<string, Direction>());
		for (const key in keys) {
			if (key.length !== 1) {
				throw new Error("keys must contain only one character");
			}
			this._innerDictionary.get(type).set(key, keys[key]);
		}
	}
}