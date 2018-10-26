import { Floor } from "../floor";

export class TempleFloor extends Floor {
	public get level(): number { return 1; }

	public get name(): string { return "temple"; }

	private _base_music: HTMLAudioElement;
	public get base_music(): HTMLAudioElement { return this._base_music; }

	constructor() {
		super();
		this._base_music = new Audio("assets/sounds/sacrificial.mp3");
		this.base_music.loop = true;
	}
}