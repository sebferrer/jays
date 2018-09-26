export interface IMiniMapColorConfig {
	visited_border: string;
	visited_fill: string;

	not_visited_border: string;
	not_visited_fill: string;

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