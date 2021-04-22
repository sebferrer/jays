import { Entity } from "./entity";
import { Sprite } from "./sprite";
import { Point } from "./point";
import { ActionableEntity } from "./actionable_entity";
import { IDialogNode, DialogGraph } from "./messages/dialog_graph";
import { MessageBox } from "./messages/message_box";

export class Sign extends ActionableEntity {
    public message: IDialogNode;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number, floor_level: number, room_number: number, action_hitbox_ratio?: number, message?: IDialogNode) {
        super(id, current_sprite, position, width, height, floor_level, room_number, action_hitbox_ratio);
        this.message = message;
    }

    public action() {
        const msg = new MessageBox(new DialogGraph("San", this.message));
        this.occuring = true;
        msg.start();
    }
}

export class ActionableEntityHitbox extends Entity {
    public action_hitbox: Entity;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number) {
        super(id, current_sprite, Point.copy(position), width, height, false);
    }
}