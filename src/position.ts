export class Position {
	public pos_x: number;
	public pos_y: number;
	constructor(x?: number, y?: number) {
		this.pos_x = x == null ? 0 : x;
		this.pos_y = y == null ? 0 : y;
	}
}

