class AntiAfk {
  constructor(win) {
    this.window = win;
    this.window.dofus.disconnectBackup = this.window.dofus.disconnect;
    this.window.gui.openSimplePopupBackup = this.window.gui.openSimplePopup;

    this.window.dofus.disconnect = this.disconnectOverride.bind(this);
    this.window.gui.openSimplePopup = this.openSimplePopupOverride.bind(this);

    this.ignoreMessages = [
      "Une inactivité prolongée entraîne une déconnexion automatique du serveur. Vous pouvez fermer cette boite de dialogue pour donner un signe d'activité."
    ];
    setInterval(() => {
      if (this.window.isoEngine.isInGame) {
        this.window.dofus.sendMessage('BasicPingMessage', { quiet: true });
      }
    }, 240000);
  }

  disconnectOverride(reason) {
    if (reason != "INACTIVITY") {
      this.window.dofus.disconnectBackup();
    } else {
      console.debug('[ANTIAFK] Shield activated !');
      this.window.Dofucks.Farmer.process();
    }
  }

  openSimplePopupOverride(a, b) {
    if (this.ignoreMessages.indexOf(a) == -1) {
      this.window.gui.openSimplePopupBackup(a, b);
    } else {
      this.window.Dofucks.Farmer.process();
    }
  }
}

export default AntiAfk;
