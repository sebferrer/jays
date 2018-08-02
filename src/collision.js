class Collision {
    constructor() {}

    static is_collision(collisioner_x1, collisioner_y1, collisioner_x2, collisioner_y2,
                        collisionee_x1, collisionee_y1, collisionee_x2, collisionee_y2) {
        return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
        collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1;
    }

    /**
     * TODO: I'd like to make Jays able to crossing most of the warp before changing map without writing ugly code...
     */

   /* static is_collision_half(direction_event, tile,
                            collisioner_x1, collisioner_y1, collisioner_x2, collisioner_y2,
                            collisionee_x1, collisionee_y1, collisionee_x2, collisionee_y2) {
        if(direction_event.move_down) {
            let next_warp = false;
            if(tile.coord_y+1 <= gameState.current_map.width) {
                //next_warp = gameState.current_map.tiles[tile.coord_y+1][tile.coord_x].is_warp;
            }
            return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
            collisioner_y1 < collisionee_y2 && collisioner_y2-(collisioner_y2-collisioner_y1) > collisionee_y1+(collisionee_y2-collisionee_y1)/2 &&
            !next_warp;
        }
        else if(direction_event.move_up) {
            let next_warp = false;
            if(tile.coord_y-1 >= 0) {
                next_warp = gameState.current_map.tiles[tile.coord_y-1][tile.coord_x].is_warp;
            } 
            return collisioner_x1 < collisionee_x2  && collisioner_x2 > collisionee_x1 &&
            collisioner_y1-(collisioner_y1-collisioner_y2) < collisionee_y2-(collisionee_y2-collisionee_y1)/2 && collisioner_y2 > collisionee_y1 &&
            !next_warp;
        }
        else if(direction_event.move_right) {
            let next_warp = false;
            if(tile.coord_x+1 <= gameState.current_map.height) {
                next_warp = gameState.current_map.tiles[tile.coord_y][tile.coord_x+1].is_warp;
            }
            return collisioner_x1 < collisionee_x2 && collisioner_x2-(collisioner_x2-collisioner_x1) > collisionee_x1+(collisionee_x2-collisionee_x1)/1.5 &&
            collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1 &&
            !next_warp;
        }
        else if(direction_event.move_left) {
            let next_warp = false;
            if(tile.coord_x-1 >= 0) {
                next_warp = gameState.current_map.tiles[tile.coord_y][tile.coord_x-1].is_warp;
            }
            return collisioner_x1-(collisioner_x1-collisioner_x2) < collisionee_x2-(collisionee_x2-collisionee_x1)/1.5 && collisioner_x2 > collisionee_x1 &&
            collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1 &&
            !next_warp;
        }
        //console.log(direction);
    }*/
}