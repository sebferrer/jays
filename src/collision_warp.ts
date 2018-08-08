export class CollisionWarp {
	public is_collision: boolean;
	public is_warp: boolean;
	public destination: number;
	constructor(is_collision?: boolean, is_warp?: boolean, destination?: number) {
		this.is_collision = is_collision;
		this.is_warp = is_warp;
		this.destination = destination;
	}
}