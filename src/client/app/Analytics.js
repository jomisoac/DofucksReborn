import io from "socket.io-client";
import Items from "../bot/db/Items";
class Analytics {
constructor(win) {
  this.window = win;
  
  //Pricing
  this.window.dofus.connectionManager.on('ExchangeTypesItemsExchangerDescriptionForUserMessage', this.ExchangeTypesItemsExchangerDescriptionForUserMessage.bind(this));
  this.window.dofus.connectionManager.on("CharacterSelectedSuccessMessage", this.CharacterSelectedSuccessMessage.bind(this));
  
}



CharacterSelectedSuccessMessage(e){
	setTimeout(()=>{
		this.window.dofus.sendMessage("NpcGenericActionRequestMessage", {npcId: 0, npcActionId: 6, npcMapId: this.window.gui.playerData.position.mapId});
		this.window.dofus.sendMessage("ExchangeBidHouseTypeMessage", {type: 38});
		
		setInterval(()=>{
			
			for(var i = 303; i < 304 ; i++){
				this.window.dofus.sendMessage("ExchangeBidHouseListMessage", {id: i});
			}
			
			
		}, 3000);
		
	},5000);
	
	
}

ExchangeTypesItemsExchangerDescriptionForUserMessage(e) {
	//console.debug(e);
	console.debug(e.itemTypeDescriptions[0].objectUID +" -> ", e.itemTypeDescriptions[0].prices);
} 


ExchangeTypesExchangerDescriptionForUserMessage(e) {
		console.debug("ANALYTICS 2");
	}

ExchangeStartedBidBuyerMessage(e) {
		console.debug("ANALYTICS 3");
	}


ExchangeStartedBidSellerMessage() {
		console.debug("ANALYTICS 4");
	}



	
	
}
export default Analytics;
