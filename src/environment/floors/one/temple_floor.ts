import { Floor } from "../floor";
import { AudioFile } from "../../../audio_file";
import { Direction } from "../../../enum";
import { FourFireRoom } from "../../rooms/four_fire_room";
import { EmptyGrassRoom } from "../../rooms/empty_grass_room";
import { WaterLeftRightRoom } from "../../rooms/water_left_right_room";
import { DeadEndRightRoom } from "../../rooms/dead_end_right_room";

export class TempleFloor extends Floor {
	public get level(): number { return 1; }

	public get name(): string { return "temple"; }

	private _base_music: AudioFile;
	public get base_music(): AudioFile { return this._base_music; }

	protected _available_rooms = [
		FourFireRoom,
		EmptyGrassRoom,
		WaterLeftRightRoom,
		DeadEndRightRoom
	];

	constructor() {
		super();
		this._base_music = new AudioFile("assets/sounds/dungeon.mp3");
		this.base_music.loop = true;
	}
}