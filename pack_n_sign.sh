npm run pack:osx
sudo spctl --master-disable
node node_modules/.bin/electron-osx-sign --identity="DofucksSquirrel" builds/Dofucks-darwin-x64/Dofucks.app
sudo spctl --master-enable
