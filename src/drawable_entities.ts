import { DrawableEntity } from "./drawable_entity";
import { Point } from "./point";
import { Rock } from "./environment/entities/rock";

export function get_drawable_entities(canvas_w, canvas_h): DrawableEntity[] {
	return [
		new Rock(2, new Point(100, 100), 1, 1),
		new Rock(2, new Point(210, 120), 1, 1),
		new Rock(2, new Point(350, 300), 1, 1),
		new Rock(2, new Point(240, 250), 1, 1),
		new Rock(2, new Point(380, 150), 1, 1)
	]
}
