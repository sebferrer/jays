import { AudioFile } from "../../audio_file";
import { Direction } from "../../enum";
import { canvas_H, canvas_W, gameState, renderer } from "../../main";
import { Point } from "../../point";
import { FloorMap } from "../floor_map";
import { get_room_map_definitions, RoomMapDefinition } from "../rooms/room_map_definition.decorator";
import { Door } from "../walls/door";
import { RoomMap } from "../rooms/room_map";
import { ActionableEntity } from "../../actionable_entity";
import { ArrayUtil, MathUtil } from "../../util";
import { get_actionable_entities } from "../../actionable_entities";
import { Collision } from "../../collision";
import { Rect } from "../../rect";

export abstract class Floor {
	public abstract get level(): number;
	public abstract get name(): string;

	// NB: music can't be played if the user hasn't interacted with the page. Otherwise: 
	// DOMException: play() failed because the user didn’t interact with the document first
	public abstract get base_music(): AudioFile;

	protected _floor_map: FloorMap;
	public get floor_map(): FloorMap { return this._floor_map; }

	protected abstract _available_rooms: any[];
	public get available_rooms(): RoomMapDefinition[] { return get_room_map_definitions(this._available_rooms); }

	public rooms: RoomMap[];
	public rooms_ids: number[];

	public actionable_entities: ActionableEntity[];

	constructor() {
		this.rooms = new Array<RoomMap>();
	}

	public initialize(): void {
		this.rooms_ids = new Array<number>();
		this._floor_map = new FloorMap(this);

		this.actionable_entities = get_actionable_entities(canvas_W, canvas_H);
		// this.actionable_entities.push(new Sign("first_sign", new Sprite(0, 0, 29, 31), new Point(canvas_W / 2 - 15, canvas_H / 2 - 100), 29, 31, true, 0, 1, this.first_room_id, 0.5, first_sign));
		this.spread_entities(["angry_dialog", "sample_dialog", "glitchy_dialog"], /*ArrayUtil.diff(*/this.rooms_ids/*, [this.first_room_id])*/);
		this.rooms.forEach(
			room => {
				room.actionable_entities.forEach(entity => {
					let good_location = false;
					while (!good_location) {
						entity.set_position(new Point(
							MathUtil.get_random_int(60, canvas_W - entity.width - 60),
							MathUtil.get_random_int(60, canvas_H - entity.height - 60)
						));
						good_location = !Collision.is_collision_rects(
							new Rect(entity.position.x, entity.position.y, entity.width, entity.height),
							room.taken_spaces);
					}
					room.taken_spaces.push(new Rect(entity.position.x, entity.position.y, entity.width, entity.height));
				});
			}
		);

		// Draw minimap
		this.floor_map.next_room();

		renderer.update_minimap(this.floor_map);
	}

	public on_collision_warp(door: Door) {

		// Remove tears
		gameState.tears.splice(0, gameState.tears.length);

		gameState.current_room = this.floor_map.next_room(door.direction);
		renderer.update_current_room(gameState.current_room);
		switch (door.direction) {
			case Direction.LEFT:
				gameState.jays.position = new Point(canvas_W - gameState.current_room.room_walls.wall_height - gameState.jays.width, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.RIGHT:
				gameState.jays.position = new Point(60, (canvas_H / 2) - (gameState.jays.height / 2));
				break;
			case Direction.UP:
				gameState.jays.position = new Point((canvas_W / 2) - (gameState.jays.width / 2), canvas_H - gameState.current_room.room_walls.wall_height - gameState.jays.height);
				break;
			case Direction.DOWN:
				gameState.jays.position = new Point((canvas_W / 2) - (gameState.jays.width / 2), gameState.current_room.room_walls.wall_height);
				break;
		}

		// Re-draw minimap
		renderer.update_minimap(this.floor_map);
	}

	public spread_entities(entities_ids: string[], rooms_ids: number[]): void {
		if (entities_ids.length > rooms_ids.length) {
			throw new Error("Cannot spread entities when there are more entities than rooms");
		}

		let i = 0;
		const shuffled_rooms_ids = ArrayUtil.shuffle(rooms_ids);
		entities_ids.forEach(entity_id => {
			console.log("Attribute entity " + entities_ids[i] + " to room " + shuffled_rooms_ids[i]);
			this.rooms.find(room => room.id === shuffled_rooms_ids[i]).actionable_entities
				.push(this.actionable_entities.find(entity => entity.id === entity_id));
			i++;
		});
	}
}