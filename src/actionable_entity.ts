import { Entity } from "./entity";
import { Sprite } from "./sprite";
import { Point } from "./point";
import { IDrawable } from "./idrawable";
import { IMAGE_BANK } from "./main";

export class ActionableEntity extends Entity implements IDrawable {
    public action_hitbox_ratio: number;
    public action_hitbox: ActionableEntityHitbox;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number, action_hitbox_ratio?: number) {
        super(id, current_sprite, Point.copy(position), width, height);
        this.action_hitbox_ratio = this.action_hitbox_ratio == null ? 0 : this.action_hitbox_ratio;
        this.sprite_filename = "assets/img/object.png";
        this.action_hitbox = new ActionableEntityHitbox(this.id + "-hitbox", null,
            new Point(this.position.x - this.width * this.action_hitbox_ratio, this.position.y - this.height * this.action_hitbox_ratio),
            this.width + this.width * this.action_hitbox_ratio, this.height + this.height * this.action_hitbox_ratio);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(IMAGE_BANK.pictures[this.sprite_filename],
            this.current_sprite.src_x, this.current_sprite.src_y, this.current_sprite.src_width, this.current_sprite.src_height,
            this.position.x, this.position.y, this.width, this.height);
    }
}

export class ActionableEntityHitbox extends Entity {
    public action_hitbox: Entity;

    constructor(id: string, current_sprite: Sprite, position: Point, width: number, height: number) {
        super(id, current_sprite, Point.copy(position), width, height, false);
    }
}