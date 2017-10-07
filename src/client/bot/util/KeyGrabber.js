class KeyGrabber {
  constructor(win) {
    this.window = win;
    this.init();
  }

  init() {
    this.window.document.addEventListener('keydown', (event) => {
      if (this.window.gui && this.window.gui.numberInputPad && this.window.gui.numberInputPad._elementIsVisible) {
        if (event.keyCode == 13) {
          this.window.gui.numberInputPad._doEnter();
        } else if(event.keyCode == 8) {
          this.window.gui.numberInputPad._doBackspace();
        } else if(event.keyCode >= 48 && event.keyCode <= 57) {
          this.window.gui.numberInputPad._doDigit(event.code[5]);
        } else if(event.keyCode >= 96 && event.keyCode <= 105) {
          this.window.gui.numberInputPad._doDigit(event.code[6]);
        }
      }
    });
  }
}

export default KeyGrabber;
