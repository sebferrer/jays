import { IMiniMapColorConfig } from "./iminimap_configuration";
import { WallSprite } from "./walls/wall_sprite";

/** Identifies a room which has a custom icon on the minimap */
export interface IIConRoom {
	color_configuration: IMiniMapColorConfig;
	icon: WallSprite;
}

export function isIIConRoom(object: any): object is IIConRoom {
	return "color_configuration" in object && "icon" in object;
}