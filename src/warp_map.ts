import { WarpDesc } from "./warp_desc";

export class WarpMap {
    public map_id: number;
    public zones: WarpDesc[];
    constructor(map_id?: number, zones?: WarpDesc[]) {
        this.map_id = map_id;
        this.zones = zones;
    }
}