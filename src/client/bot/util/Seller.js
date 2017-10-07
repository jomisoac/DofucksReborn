var random = require('random-js')();

class Seller {

  constructor(win) {
    this.window = win;
    this.canSellByTen = false;
  	this.actionStep = 0;
  	this.wantToSell = [];
  	this.currentItem = false;
  	this.currentItemIndex = 0;
  	this.currentItemPrices = [];
    this.isSelling = false;
    this.callback = null;
		this.window.dofus.connectionManager.on('ExchangeTypesItemsExchangerDescriptionForUserMessage', this.ExchangeTypesItemsExchangerDescriptionForUserMessage.bind(this));
		this.window.dofus.connectionManager.on('ExchangeTypesExchangerDescriptionForUserMessage', this.ExchangeTypesExchangerDescriptionForUserMessage.bind(this));
		this.window.dofus.connectionManager.on('ExchangeStartedBidBuyerMessage', this.ExchangeStartedBidBuyerMessage.bind(this));
		this.window.dofus.connectionManager.on('ExchangeStartedBidSellerMessage', this.ExchangeStartedBidSellerMessage.bind(this));
		this.window.dofus.connectionManager.on('ExchangeLeaveMessage', this.ExchangeLeaveMessage.bind(this));
  }

	getNextItem() {
		if (!this.wantToSell.length) {
			return false;
		}
		if (this.currentItemIndex < this.wantToSell.length) {
			var objectGID = this.wantToSell[this.currentItemIndex];
			var item = this.getItem(this.wantToSell[this.currentItemIndex++]);
			return item ? item : this.getNextItem();
		} else {
			this.currentItemIndex = 0;
			return false;
		}
	}

	getItem(itemGID) {
		for (var index in this.window.gui.playerData.inventory.objects) {
			var object = this.window.gui.playerData.inventory.objects[index];
			if (object.objectGID == itemGID && (this.canSellByTen ? object.quantity >= 10 : object.quantity >= 100)) {
				return object;
			}
		}
		return false;
	}

  sellObjectInQuantity(object, qty, price) {
		var timeout = 0;
		var objqty = object.quantity;
		price = price -1;
		while (objqty >= qty) {
			objqty -= qty;
			timeout += random.integer(500, 1500);
			setTimeout(() => {
				console.debug("[SELLER] selling "+qty+" "+object.objectGID+" at "+price+"k");
				this.window.dofus.sendMessage("ExchangeObjectMovePricedMessage", {objectUID: object.objectUID, quantity: qty, price: price});
			}, timeout);
		}
		return timeout;
	}
	getPriceForItemQuantity(item, qty, prices) {
		if (!prices) {
			return qty * 100;
		}
		if (qty == 100) {
			return (prices.length >= 3 ? prices[2] : (prices.length >= 2 ? prices[1] * 10 : (prices.length >= 1 ? prices[0] * 100 : 10000)));
		}
		if (qty == 10) {
			return (prices.length >= 2 ? prices[1] : (prices.length >= 1 ? prices[0] * 10 : 1000));
		}
		if (qty == 1) {
			return (prices.length >= 1 ? prices[0] : 100);
		}
	}

  start() {
    this.isSelling = true;
  }

  stop() {
    this.isSelling = false;
  }

	ExchangeStartedBidBuyerMessage(e) {
    if (!this.isSelling) {
      return;
    }
		console.debug("[SELLER] ExchangeStartedBidBuyerMessage()");
	}

	ExchangeTypesExchangerDescriptionForUserMessage(e) {
    if (!this.isSelling) {
      return;
    }
		console.debug("[SELLER] ExchangeTypesExchangerDescriptionForUserMessage()");
		var timeout = random.integer(1000, 3500);
		if (this.currentItem) {
			setTimeout(() => {
				var items = e.typeDescription;
				if (-1 == items.indexOf(this.currentItem.item.id)) {
					console.debug("No item in HDV");
					this.actionStep = 4;
					this.window.dofus.sendMessage("LeaveDialogRequestMessage");
					return;
				}
				this.actionStep = 3;
				this.window.dofus.sendMessage("ExchangeBidHouseListMessage", {id: this.currentItem.item.id});
			}, timeout);
		}
	}

	ExchangeTypesItemsExchangerDescriptionForUserMessage(e) {
    if (!this.isSelling) {
      return;
    }
		console.debug("[SELLER] ExchangeTypesItemsExchangerDescriptionForUserMessage()");

		if (this.currentItem) {
			var timeout = random.integer(500, 1000);
			setTimeout(() => {
  			if (e.itemTypeDescriptions.length) {
  				this.currentItemPrices = e.itemTypeDescriptions[0].prices;
  				this.actionStep = 4;
  				this.window.dofus.sendMessage("LeaveDialogRequestMessage");
  				this.actionStep = 5;
  				this.window.dofus.sendMessage("NpcGenericActionRequestMessage", {npcId: 0, npcActionId: 5, npcMapId: this.window.gui.playerData.position.mapId});
  			} else {
  				console.debug("nok1");
  			}
  		}, timeout);
		} else {
			console.debug("nok2");
		}
	}

	ExchangeLeaveMessage() {
    if (!this.isSelling) {
      return;
    }
		console.debug("[SELLER] ExchangeLeaveMessage()");
		if (this.currentItem) {
			var timeout = random.integer(1000, 1500);
			setTimeout(() => {
				switch (this.actionStep) {
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
					break;
					case 6:
					this.stop();
					this._do();
					break;
					default:
					console.debug("[SELLER] ExchangeLeaveMessage: No action for step "+this.actionStep);
					this.stop();
					break;
				}
			}, timeout);
		}
	}

	ExchangeStartedBidSellerMessage() {
    if (!this.isSelling) {
      return;
    }
		console.debug("[SELLER] ExchangeStartedBidSellerMessage()");
		if (this.currentItem) {
			var timeout = random.integer(1000, 2000);
			setTimeout(() => {
				var finalTimeout = this.sellObjectInQuantity(this.currentItem, 100, this.getPriceForItemQuantity(this.currentItem, 100, this.currentItemPrices));
				setTimeout(() => {
					if (finalTimeout == 500 && this.canSellByTen) {
						finalTimeout = this.sellObjectInQuantity(this.currentItem, 10, this.getPriceForItemQuantity(this.currentItem, 10, this.currentItemPrices));
					}
					setTimeout(() => {
						this.actionStep = 6;
						this.window.dofus.sendMessage("LeaveDialogRequestMessage");
					}, finalTimeout);
				}, finalTimeout);
			}, timeout);
		}
	}

	_do(callback) {
    if (callback) {
      this.callback = callback;
    }
		if (this.currentItem = this.getNextItem()) {
			this.start();
			this.actionStep = 1;
			this.window.dofus.sendMessage("NpcGenericActionRequestMessage", {npcId: 0, npcActionId: 6, npcMapId: this.window.gui.playerData.position.mapId});
			this.actionStep = 2;
			this.window.dofus.sendMessage("ExchangeBidHouseTypeMessage", {type: this.currentItem.item.typeId});
		} else {
      console.debug("[SELLER] We can continue");
			if (this.callback) {
        console.debug("[SELLER] Callback called");
        this.callback();
        this.callback = null;
      }
		}
		return !!this.currentItem;
	}

  sell() {
    console.debug("[SELLER] I want to sell.");
    this.window.Dofucks.isLocked = true;
    setTimeout(() => {
      this._do(() => {
        this.window.Dofucks.isLocked = false;
      });
    }, 1000);
  }
}

export default Seller;
