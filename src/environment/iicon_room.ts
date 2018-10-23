import { IMiniMapRoomColorsConfig } from "./iminimap_configuration";
import { WallSprite } from "./walls/wall_sprite";

/** Identifies a room which has a custom icon on the minimap */
export interface ICustomRoom {
	color_configuration: IMiniMapRoomColorsConfig;
	icon: WallSprite;
}

export function isCustomRoom(object: any): object is ICustomRoom {
	return "color_configuration" in object && "icon" in object;
}