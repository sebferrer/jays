export enum Direction {
	UP = "Up",
	DOWN = "Down",
	LEFT = "Left",
	RIGHT = "Right"
}

export enum TileType {
	STATIC = "Static",
	PRIMARY = "Primary",
	ANIMATED = "Animated"
}

/**
 * Not sure to keep these mappings here
 * Maybe Direction should be a class with getters instead of these shitty Maps...
 * (But it's currently much better than writing 40 000 switchs)
 */
export const Direction_Int = new Map<Direction, number>([
	[Direction.UP, 3],
	[Direction.DOWN, 0],
	[Direction.LEFT, 1],
	[Direction.RIGHT, 2]
]);

export const Direction_String = new Map<Direction, string>([
	[Direction.UP, "UP"],
	[Direction.DOWN, "DOWN"],
	[Direction.LEFT, "LEFT"],
	[Direction.RIGHT, "RIGHT"]
]);

export const Key_Direction = new Map<string, Direction>([
	["z", Direction.UP],
	["s", Direction.DOWN],
	["q", Direction.LEFT],
	["d", Direction.RIGHT]
]);