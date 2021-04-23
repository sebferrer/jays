import { ActionableEntity } from "./actionable_entity";
import { Sign } from "./sign";
import { Sprite } from "./sprite";
import { Point } from "./point";
import { angry_dialog, sample_dialog, glitchy_dialog } from "./messages/dialog_graph";

export function get_actionable_entities(canvas_w, canvas_h): ActionableEntity[] {
	return [
		new Sign("angry_dialog", new Sprite(0, 0, 29, 31), new Point(canvas_w / 2 - 15, canvas_h / 2 - 100), 29, 31, true, 0, 1, null, 0.5, angry_dialog),
		new Sign("sample_dialog", new Sprite(0, 0, 29, 31), new Point(canvas_w / 2 - 15, canvas_h / 2 - 100), 29, 31, true, 0, 1, null, 0.5, sample_dialog),
		new Sign("glitchy_dialog", new Sprite(0, 0, 29, 31), new Point(canvas_w / 2 - 15, canvas_h / 2 - 100), 29, 31, true, 0, 1, null, 0.5, glitchy_dialog)
	]
}
