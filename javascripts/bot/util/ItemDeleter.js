var random = require('random-js')();

class ItemDeleter {
  constructor(win) {
    this.window = win;
    this.timeBetweenDeleteMin = 500;
    this.timeBetweenDeleteMax = 1000;
    this.wantToDelete = [];
  }

  deleteThen(itemsToDelete, callback) {
    var items2Delete = itemsToDelete ? itemsToDelete : this.wantToDelete;
    for (var index in this.window.gui.playerData.inventory.objects) {
      var object = this.window.gui.playerData.inventory.objects[index];
      if (items2Delete.indexOf(object.objectGID) !== -1) {
        var objqty = object.quantity;
        var wait = this.deleteItem(object, objqty);
        if (wait > 0) {
          setTimeout(() => {
            this.deleteThen(items2Delete, callback);
          }, wait+100);
          return;
        }
      }
    }
     if (callback) {
       callback();
     }
  }

  deleteItem(object, qty) {
    var timeout = random.integer(this.timeBetweenDeleteMin, this.timeBetweenDeleteMax);
    setTimeout(() => {
			console.debug("[ITEM_DELETER] Deleting "+qty+" "+object.objectUID);
			this.window.dofus.sendMessage("ObjectDeleteMessage", {objectUID: object.objectUID, quantity: qty});
    }, timeout);
    return timeout;
  }
}

export default ItemDeleter;
