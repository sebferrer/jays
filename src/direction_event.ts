export class DirectionEvent {
	public move_up: boolean;
	public move_down: boolean;
	public move_left: boolean;
	public move_right: boolean;

	constructor() {
		this.move_up = false;
		this.move_down = false;
		this.move_left = false;
		this.move_right = false;
	}
}