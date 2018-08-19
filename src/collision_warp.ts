export class CollisionWarp {
	public is_collision: boolean;
	public destination: number;
	constructor(is_collision?: boolean, destination?: number) {
		this.is_collision = is_collision;
		this.destination = destination;
	}
}