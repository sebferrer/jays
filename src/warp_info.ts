import { WarpType } from "./enum";

export class WarpInfo {
	public destination: number;
	public type: WarpType;
	constructor(destination?: number, type?: WarpType) {
		this.destination = destination == null ? 0 : destination;
		this.type = type;
	}
}