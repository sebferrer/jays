import { AudioFile } from "../../../audio_file";
import { DeadEndRightRoom } from "../../rooms/dead_end_right_room";
import { EmptyGrassRoom } from "../../rooms/empty_grass_room";
import { FourFireRoom } from "../../rooms/four_fire_room";
import { RockyRoom } from "../../rooms/rocky_room";
import { WaterLeftRightRoom } from "../../rooms/water_left_right_room";
import { Floor } from "../floor";

export class TempleFloor extends Floor {
	public get level(): number { return 1; }

	public get name(): string { return "temple"; }

	private _base_music: AudioFile;
	public get base_music(): AudioFile { return this._base_music; }

	protected _available_rooms = [
		FourFireRoom,
		EmptyGrassRoom,
		RockyRoom/*,
		WaterLeftRightRoom,
		DeadEndRightRoom*/
	];

	constructor() {
		super();
		this._base_music = new AudioFile("assets/sounds/musics/dungeon.mp3");
		this.base_music.loop = true;
	}
}