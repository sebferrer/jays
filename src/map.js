class Map {
    constructor(id) {
        this.id = id;
        this.width = MAPS[id].width;
        this.height = MAPS[id].height;
        this.tiles = Array();
        let line = Array();
        for(let i = 0; i < MAPS[id].tiles.length; i++) {
            line.push(Map.getTile(MAPS[id].tiles[i]));
            if(i > 0 && (i+1)%this.width == 0) {
                this.tiles.push(line);
                line = Array();
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
    constructor(id, desc, coord_x, coord_y, has_collision) {
        this.width = 20;
        this.height = 20;
        this.id = id;
        this.desc = desc;
        this.coord_x = coord_x;
        this.coord_y = coord_y;
        this.has_collision = has_collision;
    }
}

const TILE_EARTH = new Tile(1, "Earth", 0, 0, false);
const TILE_ROCK = new Tile(2, "Rock", 0, 1, false);
const TILE_WATER = new Tile(3, "Water", 0, 2, false);
const TILE_GRASS = new Tile(4, "Grass", 0, 3, false);
const TILE_IRON = new Tile(12, "Iron", 2, 1, false);