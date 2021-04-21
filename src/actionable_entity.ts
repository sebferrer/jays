import { Entity } from "./entity";
import { Sprite } from "./sprite";
import { Point } from "./point";
import { IDrawable } from "./idrawable";
import { IActionable } from "./iactionable";
import { IMAGE_BANK } from "./main";

export abstract class ActionableEntity extends Entity implements IDrawable, IActionable {
    public action_hitbox_ratio: number;
    public action_hitbox: ActionableEntityHitbox;
    public actionable: boolean;
    public floor_level: number;
    public room_number: number;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number, floor_level: number, room_number: number, action_hitbox_ratio?: number) {
        super(id, current_sprite, Point.copy(position), width, height);
        this.action_hitbox_ratio = action_hitbox_ratio == null ? 0 : action_hitbox_ratio;
        this.sprite_filename = "assets/img/object.png";
        this.action_hitbox = new ActionableEntityHitbox(this.id + "-hitbox", null,
            new Point(position.x - width * this.action_hitbox_ratio, position.y - height * this.action_hitbox_ratio),
            width + width * this.action_hitbox_ratio * 2, height + height * this.action_hitbox_ratio * 2);
        this.actionable = false;
        this.floor_level = floor_level;
        this.room_number = room_number;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(IMAGE_BANK.pictures[this.sprite_filename],
            this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
            this.position.x, this.position.y, this.width, this.height);
    }

    public abstract action(): void;
}

export class ActionableEntityHitbox extends Entity {
    public action_hitbox: Entity;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number) {
        super(id, current_sprite, Point.copy(position), width, height, false);
    }
}