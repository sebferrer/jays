export class Sprite {
	public src_x: number;
	public src_y: number;
	public src_width: number;
	public src_height: number;
	public collec_id: string;

	constructor(src_x: number, src_y: number, src_width: number, src_height: number, collec_id?: string) {
		this.src_width = src_width;
		this.src_height = src_height;
		this.src_x = src_x;
		this.src_y = src_y;
		this.collec_id = collec_id;
	}
}