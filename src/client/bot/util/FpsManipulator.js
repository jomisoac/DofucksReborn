class FpsManipulator {
  constructor(win) {
    this.window = win;
    this.fps = 25;
    this.refreshRate = 0;

    this.callStack = {0:[],1:[]}
    this.current = 0;
    this.lastTime = (new Date()).getTime();
    this.currentTime = (new Date()).getTime();
    this.count = 0;
    this.offsetTime = 0;
    this.currentTimeout = 0;

    this.setFps(25);
    this.window.requestAnimationFrame = (fct) => {
      this.callStack[this.current].push(fct);
    }
  }

  setFps(fps) {
    if (fps < 1 || fps > 60) return new Error("Please set fps between 1 and 60");
    this.fps = fps;
    this.refreshRate = 1000/this.fps;
    clearTimeout(this.currentTimeout);
    this.interval();
  }

  interval() {
      var cftc = this.callStack[this.current] // Current functions to call
      this.current = -this.current+1;
      for (var id in cftc) {
          cftc[id]();
      }
      this.callStack[-this.current+1] = [];

      this.count++;
      this.currentTime = (new Date()).getTime();
      var diff = this.currentTime - this.lastTime;
      this.lastTime = this.currentTime;
      if (diff > this.refreshRate) this.offsetTime--;
      else if (diff < this.refreshRate-1) this.offsetTime++;
      this.currentTimeout = setTimeout(this.interval.bind(this), this.refreshRate + this.offsetTime)
  }
}

export default FpsManipulator
