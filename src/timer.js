class Timer {
    constructor(id, interval) {
        this.id = id;
        this.interval = interval;
        this.elapsed = 0;
        this.tick = 0;
        this.enabled = false;
        this.start = 0
    }

    enable() {
        if(!this.enabled) {
            this.enabled = true;
        }
    }

    disable() {
        if(this.enabled) {
            this.enabled = false;
        }
    }
    
    // When started, add 1 tick each X interval
    run() {
        if(this.enabled) {
            this.elapsed = new Date().getTime() - this.start;
            if(this.elapsed > this.interval) {
                this.tick++;
                this.start = new Date().getTime();
            }
        }
    }

    next_tick() {
        return this.elapsed > this.interval;
    }

    reset() {
        this.elapsed = 0;
        this.tick = 0;
        this.enabled = false;
    }
}