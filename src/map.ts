import { WARPS, Warp } from "./warp";
import { MAPS } from "./maps";
import { Tile } from "./tile";

export class Map {

    public id: number;
    public width: number;
    public height: number;
    public tiles: Tile[][];
    public warps: Warp[];

    constructor(id: number) {
        this.id = id;
        this.width = MAPS[id].width;
        this.height = MAPS[id].height;
        this.tiles = new Array<Array<Tile>>();
        this.warps = new Array<Warp>();

        let line = new Array<Tile>();
        let tile_coord_x = 0
        let tile_coord_y = 0;
        for (let i = 0; i < MAPS[id].tiles.length; i++) {
            let tile_ref = Map.getTile(MAPS[id].tiles[i]);
            let tile = new Tile(tile_ref.id, tile_ref.desc, tile_ref.src_x, tile_ref.src_y, tile_ref.has_collision);
            tile.coord_x = tile_coord_x;
            tile.coord_y = tile_coord_y;
            tile.pos_x = tile.coord_x * tile.width;
            tile.pos_y = tile.coord_y * tile.height;
            tile_coord_x++;
            //let is_warp = tile.is_warp(this.id);
            //this.is_warp = {"bool": is_warp.bool, "destination": is_warp.destination};

            line.push(tile);
            if (i > 0 && (i + 1) % this.width == 0) {
                this.tiles.push(line);
                line = new Array<Tile>();
                tile_coord_x = 0;
                tile_coord_y++;
            }
        }
    }

    /**
     * TODO fix this shit
     * Remove warpmap.ts & warpdesc.ts if necessary
     */
    public get_warp(): any { // I wanted to return a WarpMap using itself a WarpDesc...
        for (var d = 0, len = WARPS.length; d < len; d++) {
            if (WARPS[d].map_id === this.id) {
                return WARPS[d];
            }
        }
        return null;
    }

    public static getTile(id): Tile {
        switch (id) {
            case 1: return TILE_EARTH; break;
            case 2: return TILE_ROCK; break;
            case 3: return TILE_WATER; break;
            case 4: return TILE_GRASS; break;
            case 5: return TILE_GRASS_TEXTURED_LIGHT; break;
            case 9: return TILE_GRASS_LIGHT; break;
            case 10: return TILE_GRASS_TEXTURED; break;
            case 12: return TILE_IRON; break;
        }
    }
}

export const TILE_REF = new Tile(0, "", -1, -1, false);

const TILE_EARTH = new Tile(1, "Earth", 0, 0, false);
const TILE_ROCK = new Tile(2, "Rock", 1, 0, true);
const TILE_WATER = new Tile(3, "Water", 2, 0, true);
const TILE_GRASS = new Tile(4, "Grass", 3, 0, false);
const TILE_GRASS_TEXTURED_LIGHT = new Tile(5, "Grass textured light", 4, 0, false);
const TILE_GRASS_LIGHT = new Tile(9, "Grass light", 3, 1, false);
const TILE_GRASS_TEXTURED = new Tile(10, "Grass textured", 4, 1, false);
const TILE_IRON = new Tile(12, "Iron", 1, 2, true);