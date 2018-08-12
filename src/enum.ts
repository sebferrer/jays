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

export const Direction_Int = new Map([
	[Direction.UP, 3],
	[Direction.DOWN, 0],
	[Direction.LEFT, 1],
	[Direction.RIGHT, 2]
]);

export const Direction_String = new Map([
	[Direction.UP, "UP"],
	[Direction.DOWN, "DOWN"],
	[Direction.LEFT, "LEFT"],
	[Direction.RIGHT, "RIGHT"]
]);