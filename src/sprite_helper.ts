import { Sprite } from "./sprite";
import { SPRITES } from "./sprites";

export class SpriteHelper {

	public static get_collecs(entity_id: string): Map<string, Sprite[]> {
		const sprite_collecs = new Map<string, Sprite[]>();
		SPRITES.filter(sprite => sprite.entity_id === entity_id)
			.forEach(sprite => {
				sprite_collecs.set(sprite.collec_id, sprite.collec_sprites
					.map(s => new Sprite(s[0], s[1], s[2], s[3], sprite.collec_id)));
			});
		return sprite_collecs;
	}

}