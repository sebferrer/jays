import { renderer, gameState } from "./main";
import { KeyboardType } from "./enum";

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

	public static set_jays(param: string, val: number) {
		switch (param) {
			case "speed":
				gameState.jays.speed = Number(val);
				break;
			case "tear_delay":
				gameState.jays.set_tear_delay(Number(val));
				break;
			case "range":
				gameState.jays.range = Number(val);
				break;
		}
	}

	public static set_keyboard(type) {
		switch (type) {
			case "azerty":
				gameState.keyboard.set(KeyboardType.AZERTY);
				break;
			case "qwerty":
				gameState.keyboard.set(KeyboardType.QWERTY);
				break;
		}
	}

}