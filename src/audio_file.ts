import { Settings } from "./settings/settings";

export class AudioFile {

	private _file_path: string;
	public get file_path(): string {
		return this._file_path;
	}

	private _audio: HTMLAudioElement;

	constructor(file_path: string) {
		if (file_path == null) {
			throw new Error("Parameter 'file_path' cannot be null");
		}
		this._file_path = file_path;
		this._audio = new Audio(this._file_path);
	}

	public play(): void {
		if (!Settings.enable_audio) {
			return;
		}
		(this._audio.cloneNode(true) as HTMLAudioElement).play();
	}
}