import { Floor } from "../floor";
import { AudioFile } from "../../../audio_file";

export class TempleFloor extends Floor {
	public get level(): number { return 1; }

	public get name(): string { return "temple"; }

	private _base_music: AudioFile;
	public get base_music(): AudioFile { return this._base_music; }

	constructor() {
		super();
		this._base_music = new AudioFile("assets/sounds/dungeon.mp3");
		this.base_music.loop = true;
	}
}