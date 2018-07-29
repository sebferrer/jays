class Collision {
    constructor() {}

    static is_collision(collisioner_x1, collisioner_y1, collisioner_x2, collisioner_y2,
                        collisionee_x1, collisionee_y1, collisionee_x2, collisionee_y2) {
        return collisioner_x1 < collisionee_x2 && collisioner_x2 > collisionee_x1 &&
        collisioner_y1 < collisionee_y2 && collisioner_y2 > collisionee_y1 
    }
}