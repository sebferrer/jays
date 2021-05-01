import { DrawableEntity } from "../../drawable_entity";
import { Sprite } from "../../sprite";
import { Point } from "../../point";

export class Rock extends DrawableEntity {
    constructor(type: number, position?: Point, floor_level?: number, room_number?: number) {
        let id: string;
        let sprite: Sprite;
        let width: number;
        let height: number;
        switch (type) {
            case 2:
                id = "rock-2";
                sprite = new Sprite(0, 0, 60, 40);
                width = 60;
                height = 40;
                break;
        }
        super(id, sprite, position, width, height, true, 0, floor_level, room_number);
        this.sprite_filename = "assets/img/environment.png";
    }
}

export const ROCK_2 = new Rock(2);