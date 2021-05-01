export class CollisionDelta {
	public is_collision: boolean;
	public delta_x: number;
	public delta_y: number;
	public height_perspective: number;
	constructor(is_collision?: boolean, delta_x?: number, delta_y?: number, height_perspective?: number) {
		this.height_perspective = height_perspective == null ? 0 : height_perspective;
		this.is_collision = is_collision;
		this.delta_x = delta_x == null ? 0 : delta_x;
		this.delta_y = delta_y == null ? 0 : delta_y - this.height_perspective;
	}
}