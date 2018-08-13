import { SPRITES } from "./sprites";
import { Sprite } from "./sprite";

export class SpriteHelper {
	
	public static getCollecs(entity_id: string): Map<string, Sprite[]> {
		const sprite_collecs = new Map<string, Sprite[]>();
		for (var d = 0, len = SPRITES.length; d < len; d++) {
			if (SPRITES[d].entity_id === entity_id) {
				const sprites = new Array<Sprite>();
				for (let i = 0; i < SPRITES[d].collec_sprites.length; i++) {
					sprites.push(new Sprite(SPRITES[d].collec_sprites[i][0], SPRITES[d].collec_sprites[i][1],
						SPRITES[d].collec_sprites[i][2], SPRITES[d].collec_sprites[i][3], SPRITES[d].collec_id));
				}
				sprite_collecs.set(SPRITES[d].collec_id, sprites);
			}
		}
		return sprite_collecs;
	}

}