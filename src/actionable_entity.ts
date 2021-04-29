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
    public occuring: boolean;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number,
        has_collision_objects?: boolean, height_perspective?: number,
        floor_level?: number, room_number?: number, action_hitbox_ratio?: number) {

        super(id, current_sprite, Point.copy(position), width, height,
            has_collision_objects, height_perspective, floor_level, room_number);
        this.action_hitbox_ratio = action_hitbox_ratio == null ? 0 : action_hitbox_ratio;
        this.actionable = false;
        this.occuring = false;
        if (position != null) {
            this.action_hitbox = new ActionableEntityHitbox(this.id + "-hitbox", null,
                new Point(position.x - width * this.action_hitbox_ratio, position.y - height * this.action_hitbox_ratio),
                width + width * this.action_hitbox_ratio * 2, height + height * this.action_hitbox_ratio * 2);
        }
    }

    public set_position(position: Point) {
        this.position = new Point(position.x, position.y);
        this.action_hitbox = new ActionableEntityHitbox(this.id + "-hitbox", null,
            new Point(position.x - this.width * this.action_hitbox_ratio, position.y - this.height * this.action_hitbox_ratio),
            this.width + this.width * this.action_hitbox_ratio * 2, this.height + this.height * this.action_hitbox_ratio * 2);
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