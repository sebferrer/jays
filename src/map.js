class Map {
    constructor(id) {
        this.id = id;
        this.width = MAPS[id].width;
        this.height = MAPS[id].height;
        this.tiles = Array();
        let line = Array();
        let tile_coord_x = 0
        let tile_coord_y = 0;
        for(let i = 0; i < MAPS[id].tiles.length; i++) {
            let tile_ref = Map.getTile(MAPS[id].tiles[i]);
            let tile = new Tile(tile_ref.id, tile_ref.decs, tile_ref.src_x, tile_ref.src_y, tile_ref.has_collision);
            tile.coord_x = tile_coord_x;
            tile.coord_y = tile_coord_y;
            tile.pos_x = tile.coord_x*tile.width;
            tile.pos_y = tile.coord_y*tile.height;
            tile_coord_x++;
            line.push(tile);
            if(i > 0 && (i+1)%this.width == 0) {
                this.tiles.push(line);
                line = Array();
                tile_coord_x = 0;
                tile_coord_y++;
            }
        }
    }

    static getTile(id) {
        switch(id) {
            case 1: return TILE_EARTH; break;
            case 2: return TILE_ROCK; break;
            case 3: return TILE_WATER; break;
            case 4: return TILE_GRASS; break;
            case 12: return TILE_IRON; break;
        }
    }
}

class Tile {
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
    }
}

const TILE_EARTH = new Tile(1, "Earth", 0, 0, false);
const TILE_ROCK = new Tile(2, "Rock", 0, 1, true);
const TILE_WATER = new Tile(3, "Water", 0, 2, true);
const TILE_GRASS = new Tile(4, "Grass", 0, 3, false);
const TILE_IRON = new Tile(12, "Iron", 2, 1, true);