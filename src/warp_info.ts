import { WarpType } from "./enum";

export class WarpInfo {
	public is_warp: boolean;
	public destination: number;
	public type: WarpType;
	constructor(is_warp?: boolean, destination?: number, type?: WarpType) {
		this.is_warp = is_warp;
		this.destination = destination == null ? 0 : destination;
		this.type = type;
	}
}