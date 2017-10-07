class Queue {
  constructor(win) {
    this.window = win;
    this.queue = [];
    this.isBusy = false;
    this.start();
  }

  start() {
    if (this.queue.length && !this.isBusy) {
      this.isBusy = true;
      console.debug("[QUEUE] Begin action");
      this.processAction(this.queue[0]);
    }
    setTimeout(() => {this.start()}, 500);
  }

  finishAction() {
    this.queue.splice(0, 1);
    this.isBusy = false;
  }

  processAction(queued) {
    queued.action(queued.params);
    if (queued.eventToWait) {
      queued.waitFrom.once(queued.eventToWait, (e) => {
        console.debug("[QUEUE] Finish action (and waiting "+queued.sleep+" ms)");
        setTimeout(() => {
          this.finishAction();
          if (queued.callback) {
            queued.callback(e);
          }
        }, queued.sleep);
      });
    } else {
      this.finishAction();
    }
  }

  add(action, params, callback, eventToWait, waitFrom, sleep) {
    sleep = sleep ? sleep : 200;
    this.queue.push({
      action: action,
      params: params,
      callback: callback,
      eventToWait: eventToWait,
      waitFrom: waitFrom ? waitFrom : this.window.isoEngine,
      sleep: sleep
    });
  }
}

export default Queue;
