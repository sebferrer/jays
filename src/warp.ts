import { Direction } from "./enum";

/**
 * TODO: I don't know how to deal with zones type
 */
export class Warp {
	public map_id: number;
	public direction: Direction;
	public zones: any;
	constructor() {
		this.map_id;
		this.direction;
		this.zones = Array<any>(); // Vec<Vec<Pair<int, int>>> Array of array of Tiles coords(x, y)
	}
}
/**
 * TODO: Function to inject a line of tiles instead of writing 13,0 ... ... 18,0
 * Make warps types: the "zones" warps teleport Jays to the opposite of the map,
 * and the "specifics" warps teleport Jays at a specific point of destination
 */
export const WARPS = [
	{
		"map_id": 0,
		"zones": [
			{ "destination": 1, "tiles": [[13, 0], [14, 0], [15, 0], [16, 0], [17, 0], [18, 0]] },
			{ "destination": 3, "tiles": [[31, 9], [31, 10], [31, 11], [31, 12], [31, 13], [31, 14]] },
			{ "destination": 4, "tiles": [[0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14]] }
		]
	},
	{
		"map_id": 1,
		"zones": [
			{ "destination": 0, "tiles": [[13, 23], [14, 23], [14, 23], [15, 23], [16, 23], [17, 23]] },
			{ "destination": 2, "tiles": [[31, 9], [31, 10], [31, 11], [31, 12], [31, 13], [31, 14]] }
		]
	},
	{
		"map_id": 2,
		"zones": [
			{ "destination": 1, "tiles": [[0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14]] }
		]
	},
	{
		"map_id": 3,
		"zones": [
			{ "destination": 0, "tiles": [[0, 9], [0, 10], [0, 11], [0, 12], [0, 13], [0, 14]] }
		]
	}/*,
    {"map_id": 4,
     "zones": [
        {"destination": 0, "tiles": [[31, 9],[31, 10],[31, 11],[31, 12],[31, 13],[31, 14]]}
    ]}*/
];