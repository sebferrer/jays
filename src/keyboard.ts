import { KeyboardType, Direction } from "./enum";
import { gameState } from "./main";

export class Keyboard {
	public type: KeyboardType;
	public mapping: Map<KeyboardType, Map<Direction, string>>;

	constructor(type: KeyboardType) {
		this.type = type;

		this.mapping = new Map<KeyboardType, Map<Direction, string>>();
		this.mapping.set(KeyboardType.AZERTY, new Map<Direction, string>());
		this.mapping.set(KeyboardType.QWERTY, new Map<Direction, string>());
		this.mapping.get(KeyboardType.AZERTY)
			.set(Direction.UP, "z")
			.set(Direction.LEFT, "q")
			.set(Direction.DOWN, "s")
			.set(Direction.RIGHT, "d");
		this.mapping.get(KeyboardType.QWERTY)
			.set(Direction.UP, "w")
			.set(Direction.LEFT, "a")
			.set(Direction.DOWN, "s")
			.set(Direction.RIGHT, "d");
	}

	public get(direction: Direction): string {
		return this.mapping.get(this.type).get(direction);
	}

	public set(type: KeyboardType) {
		this.type = type;
	}
}