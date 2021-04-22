import { RoomMap } from "./room_map";

export class Room {
    public id: number;
    public map: RoomMap;

    constructor(id: number, map: RoomMap) {
        this.id = id;
        this.map = map;
    }
}