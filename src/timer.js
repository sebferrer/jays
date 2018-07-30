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
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }
    
    // When started, add 1 tick each X interval
    run() {
        if(this.enabled) {
            this.elapsed = new Date().getTime() - this.start;
            if(this.elapsed > this.interval) {
                this.tick += 1;
                this.start = new Date().getTime();
            }
        }
    }

    reset() {
        this.elapsed = false;
        this.tick = false;
        this.interval = false;
        this.enabled = false;
    }
}