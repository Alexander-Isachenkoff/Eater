let Game = class {
    constructor() {
        this.UPS = 60;
        this.updateTimeOut = 1000 / this.UPS;
        this.timePassedMills = 0;
        this.paused = false;
    }
    
    nextUpdate() {
        var timeFromLastFrame = (Date.now() - this.lastUpdateTime) * 1;
        this.lastUpdateTime = Date.now();        
        if (!this.paused) {
            this.timePassed = Date.now() - this.gameStartTime;
            this.timePassedMills += timeFromLastFrame;
            this.update(timeFromLastFrame);
        }
    }

    start() {
        this.timer = setInterval(this.nextUpdate.bind(this), this.updateTimeOut);
        this.gameStartTime = Date.now();
        this.lastUpdateTime = this.gameStartTime;
    }

    stop() {
        clearTimeout(this.timer);
    }

    update(timeFromLastFrame) {};
}
