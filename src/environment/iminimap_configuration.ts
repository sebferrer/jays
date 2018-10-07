export interface IMiniMapColorConfig {
	visited_border: string;
	visited_fill: string;

	not_visited_border: string;
	not_visited_fill: string;

	/** Color of the border of the room on the minimap when the character has been near the considered room */
	glimpsed_border: string;
	/** Color of the fill of room on the minimap when the character has been near the considered room */
	glimpsed_fill: string;

	active_border: string;
	active_fill: string;
}

export interface IMiniMapSizeConfig {
	room_width: number;
	room_height: number;
	room_margin: number;
}

export interface IMiniMapConfiguration {
	colors: IMiniMapColorConfig;
	sizes: IMiniMapSizeConfig;
}