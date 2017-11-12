class AntiAfk {
  constructor(win) {
    this.window = win;
    this.window.dofus.disconnectBackup = this.window.dofus.disconnect;
    this.window.gui.openSimplePopupBackup = this.window.gui.openSimplePopup;

    this.window.dofus.disconnect = this.disconnectOverride.bind(this);
    this.window.gui.openSimplePopup = this.openSimplePopupOverride.bind(this);

    this.ignoreMessages = [
      "Une inactivité prolongée entraîne une déconnexion automatique du serveur. Vous pouvez fermer cette boite de dialogue pour donner un signe d'activité.",
      "Prolonged inactivity will lead to automatic disconnection from the server. Show some sign of life (move, send a chat message, etc.) to keep your session active.",
      "La inactividad prolongada lleva a la desconexión automática del servidor. Puedes cerrar esta ventana de diálogo para dar señal de actividad.",
      "Bei längerer Inaktivität werdet ihr automatisch vom Server ausgeloggt. Das Schließen dieses Dialoges wird als Zeichen von Aktivität gewertet.",
      "Un'inattività prolungata provoca la disconnessione automatica dal server. Chiudere questa finestra di dialogo verrà considerato come un segno di attività.",
      "Muito tempo de inatividade fará com que você seja desconectado do servidor.  Fechar essa caixa de diálogo é considerado um sinal de atividade."
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
