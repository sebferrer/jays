import { ArrayUtil } from "./util";

export class AttackDirectionEvent {
    public directions: any;

    constructor() {
        // To manage the multi-key press
        // Taking always the first Direction of this array,
        // even though the user presses many attack keys in same time
        // and then releases them, only the last pressed will be taken into account
        this.directions = Array();
    }

    public add(direction) {
        ArrayUtil.addFirstNoDuplicate(this.directions, direction);
    }

    public remove(direction) {
        ArrayUtil.removeFromArray(this.directions, direction);
    }
}