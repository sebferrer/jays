export class WarpDesc {
    public destination: number;
    public tiles: number[];
    constructor(destination?: number, tiles?: number[]) {
        this.destination = destination;
        this.tiles = tiles;
    }
}