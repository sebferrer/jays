class Map {

    public id: any;
    public width: any;
    public height: any;
    public tiles: any;
    public warps: any;

    constructor(id) {
        this.id = id;
        this.width = MAPS[id].width;
        this.height = MAPS[id].height;
        this.tiles = Array();
        this.warps = Array();

        let line = Array();
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
                line = Array();
                tile_coord_x = 0;
                tile_coord_y++;
            }
        }
    }

    get_warp() {
        for (var d = 0, len = WARPS.length; d < len; d++) {
            if (WARPS[d].map_id === this.id) {
                return WARPS[d];
            }
        }
        return null;
    }

    static getTile(id) {
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

class Tile {

    public width: any;
    public height: any;
    public id: any;
    public desc: any;
    public src_x: any;
    public src_y: any;
    public coord_x: any;
    public coord_y: any;
    public pos_x: any;
    public pos_y: any;
    public has_collision: any;
    public type: any;
    public anim: any;

    constructor(id, desc, src_x, src_y, has_collision) {
        this.width = 20;
        this.height = 20;
        this.id = id;
        this.desc = desc;
        this.src_x = src_x;
        this.src_y = src_y;
        this.coord_x;
        this.coord_y;
        this.pos_x;
        this.pos_y;
        this.has_collision = has_collision;
        this.is_warp; // {true, destination} if it's a warp zone for the current map
        this.type; // ENUM TileType
        this.anim = Array(); // If primary, contains all the animated tiles IDs
    }

    same_coords(tile) {
        return this.coord_x === tile.coord_x && this.coord_y === this.coord_y;
    }

    same_coords_array(array) {
        return this.coord_x === array[0] && this.coord_y === array[1];
    }

    is_warp() {
        let warp = gameState.current_map.get_warp();
        if (warp !== null) {
            let tile = this;
            for (let i = 0; i < warp.zones.length; i++) {
                for (let j = 0; j < warp.zones[i].tiles.length; j++) {
                    if (tile.same_coords_array(warp.zones[i].tiles[j])) {
                        return { "bool": true, "destination": warp.zones[i].destination };
                    }
                }
            }
        }
        return { "bool": false, "destination": -1 };
    }
}

enum TileType {
    STATIC = "Static",
    PRIMARY = "Primary",
    ANIMATED = "Animated"
};

const TILE_REF = new Tile(0, "", -1, -1, false);

const TILE_EARTH = new Tile(1, "Earth", 0, 0, false);
const TILE_ROCK = new Tile(2, "Rock", 1, 0, true);
const TILE_WATER = new Tile(3, "Water", 2, 0, true);
const TILE_GRASS = new Tile(4, "Grass", 3, 0, false);
const TILE_GRASS_TEXTURED_LIGHT = new Tile(5, "Grass textured light", 4, 0, false);
const TILE_GRASS_LIGHT = new Tile(9, "Grass light", 3, 1, false);
const TILE_GRASS_TEXTURED = new Tile(10, "Grass textured", 4, 1, false);
const TILE_IRON = new Tile(12, "Iron", 1, 2, true);