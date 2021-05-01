import { Direction } from "./enum";

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

	public getAllDirectionsValues() {
		return [{ "direction": Direction.UP, "enabled": this.move_up }, { "direction": Direction.DOWN, "enabled": this.move_down },
		{ "direction": Direction.LEFT, "enabled": this.move_left }, { "direction": Direction.RIGHT, "enabled": this.move_right }];
	}

	public setDirection(direction: Direction, bool: boolean): void {
		switch (direction) {
			case Direction.UP:
				this.move_up = bool;
				break;
			case Direction.DOWN:
				this.move_down = bool;
				break;
			case Direction.LEFT:
				this.move_left = bool;
				break;
			case Direction.RIGHT:
				this.move_right = bool;
				break;
		}
	}

	public getCurrentDirectionToDraw(): Direction {
		if(this.move_right) {
			return Direction.RIGHT;
		}
		else if(this.move_left) {
			return Direction.LEFT;
		}
		else if(this.move_up) {
			return Direction.UP;
		}
		return Direction.DOWN;
	}
}