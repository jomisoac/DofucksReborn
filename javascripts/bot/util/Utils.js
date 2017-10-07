import ItemUser from './ItemUser';
import AntiAfk from './AntiAfk';

class Utils {
  constructor(win) {
    this.window = win;
    this.ItemUser = new ItemUser(win);
    this.AntiAfk = new AntiAfk(win);

    this.resourceElemTypeIds = [1, 8, 17, 24, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 42, 43, 44, 45, 46, 47, 48, 52, 53, 54, 55, 61, 63, 64,
      65, 66, 67, 68, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 84, 98, 99, 100, 101, 102, 104, 108, 109, 110, 111, 112, 113, 114, 121, 131, 132,
      133, 134, 135];
  }

  getCommaSeparatedNumbers(value) {
		var v = value.replace(/[^\d,]/g, '').split(',').filter(function(n){return n != ""});
		v.forEach(function(e, i){v[i] = parseInt(e);});
		return v;
	}

  isResource(c) {
    return this.resourceElemTypeIds.indexOf(c.elementTypeId) !== -1;
  }

  closeWindow(win) {
		var list = this.window.gui.windowsContainer._childrenList;
		for (var i =0; i < list.length; i++) {
			if (-1 != list[i].rootElement.className.indexOf(win)) {
				list[i].close();
				break;
			}
		}
	}
}

export default Utils;
