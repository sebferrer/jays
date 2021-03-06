import { Direction } from "../../enum";
import { RoomMap } from "./room_map";

interface RoomMapConstructor {
	new(door_positions: Direction[]): RoomMap;
}

/** The definitions of all the available RoomMaps */
const RoomMapDefinitions: { [id: string]: RoomMapDefinition } = {};

export class RoomMapDefinition {
	private _get_room_map: (door_positions: Direction[]) => RoomMap;
	public get get_room_map(): (door_positions: Direction[]) => RoomMap { return this._get_room_map; }

	private _possible_door_positions: Set<Direction>;
	public get possible_door_positions(): Set<Direction> { return this._possible_door_positions; }

	private _can_spawn: boolean;
	public get can_spawn(): boolean { return this._can_spawn; }

	constructor(
		room_map_constructor: RoomMapConstructor,
		possible_door_positions: Direction[],
		can_spawn: boolean
	) {
		this._get_room_map = (door_positions: Direction[]) => new room_map_constructor(door_positions);
		this._possible_door_positions = new Set<Direction>(possible_door_positions);
		this._can_spawn = can_spawn;
	}
}

/** Returns the definitions of the given RoomMap types */
export function get_room_map_definitions(types: any[]): RoomMapDefinition[] {
	return types.map(type => {
		const result = RoomMapDefinitions[type.name];
		if (result == null) {
			throw new Error(`Unknown RoomMap type ${type.name}. Did you forget to add a Description decorator to this class?`);
		}
		return result;
	});
}

export interface IRoomMapDefinition {
	/** The positions where doors can be placed in the room */
	possible_door_positions: Direction[];
	/** Indicates if the player can spawn in this room */
	can_spawn: boolean;
}

/** Defines how a RoomMap class should be used */
export function Definition(room_definition: IRoomMapDefinition): (ctor: RoomMapConstructor) => void {
	return (ctor: RoomMapConstructor) => {
		RoomMapDefinitions[ctor.name] = new RoomMapDefinition(ctor, room_definition.possible_door_positions, room_definition.can_spawn);
	};
}