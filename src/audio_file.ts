import { Settings } from "./settings/settings";
import { ArrayUtil } from "./util";

export class AudioFile {

	private _file_path: string;
	public get file_path(): string {
		return this._file_path;
	}

	private _audio: HTMLAudioElement;

	private _loop: boolean;
	public get loop(): boolean { return this._loop; }
	public set loop(value: boolean) { this._audio.loop = value; }

	private nodes_currently_playing = new Array<HTMLAudioElement>();

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
		const node = this._audio.cloneNode(true) as HTMLAudioElement;
		this.nodes_currently_playing.push(node);
		
		// Remove node from array when playback ends
		new Promise<void>((resolve, reject) => {
			node.onended = () => resolve();
			node.onerror = () => reject();
		}).then(() => {
			console.log("ended");
			ArrayUtil.remove_from_array(this.nodes_currently_playing, node);
			console.log(this.nodes_currently_playing.length);
		});
		node.play();
	}

	public stop(): void {
		this.nodes_currently_playing.forEach(node => {
			node.pause();
		});
		this.nodes_currently_playing = new Array<HTMLAudioElement>();
	}
}