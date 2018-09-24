import { renderer, gameState, key_mapper } from "../main";
import { KeyboardType } from "../enum";

export class Settings {

	public static init(): void {
		(window as any).settings = Settings;
	}

	public static autoscale(enableAutoScale: boolean): void {
		if (enableAutoScale) {
			renderer.autoScale();
		} else {
			renderer.scale(1);
		}
	}

	public static set_jays(param: string, val: string) {
		switch (param) {
			case "speed":
				gameState.jays.speed = Number(val);
				break;
			case "tear_delay":
				gameState.jays.tear_delay = Number(val);
				break;
			case "range":
				gameState.jays.range = Number(val);
				break;
		}
	}

	public static set_keyboard(type: string) {
		if (type == null || KeyboardType[type.toUpperCase()] == null) {
			throw new Error("type cannot be null and must exist");
		}
		key_mapper.current_keyboard_type = KeyboardType[type.toUpperCase()];
	}
}
