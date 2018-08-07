export class WarpDestination {
	public is_warp: boolean;
	public destination: number;
	constructor(is_warp?: boolean, destination?: number, delta_y?: number) {
		this.is_warp = is_warp;
		this.destination = destination == null ? 0 : destination;
	}
}