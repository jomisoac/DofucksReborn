var random = require('random-js')();

class ItemUser {
  constructor(win) {
    this.window = win;
    this.timeBetweenUseMin = 500;
    this.timeBetweenUseMax = 1000;
    this.resourceDropItems = [7941, 7942, 7943, 7944, 7945, 7946, 7947, 7948, 7949, 7950, 7951, 7952, 7953, 7954, 7955, 7956, 7957, 7958, 7959, 7960, 7961,
      7962, 7963, 7964, 7965, 7966, 7967, 7968, 7969, 7970, 7971, 7972, 7973, 7974, 7975, 7976, 7977, 7978, 7979, 7980, 7981, 7982, 7983, 7984, 7985, 7986,
      7987, 7988, 7989, 7990, 7991, 7992, 7993, 7994, 7995, 7996, 8081, 11103, 11112];
  }

  useThen(itemsToUse, callback) {
    var items2Use = itemsToUse ? itemsToUse : this.resourceDropItems;
    for (var index in this.window.gui.playerData.inventory.objects) {
      var object = this.window.gui.playerData.inventory.objects[index];
      if (items2Use.indexOf(object.objectGID) !== -1) {
        var objqty = object.quantity;
        var wait = this.use(object, objqty);
        if (wait > 0) {
          setTimeout(() => {
            this.useThen(items2Use, callback);
          }, wait+100);
          return;
        }
      }
    }
     if (callback) {
       callback();
     }
  }

  use(object, qty) {
    var timeout = 0;
    while (qty > 0) {
      qty -= 1;
      timeout += random.integer(this.timeBetweenUseMin, this.timeBetweenUseMax);
      setTimeout(() => {
        console.debug("[ITEM_USER] Using "+object.objectUID);
        this.window.dofus.sendMessage("ObjectUseMessage", {objectUID: object.objectUID});
      }, timeout);
    }
    return timeout;
  }
}

export default ItemUser;
