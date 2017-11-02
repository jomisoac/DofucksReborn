#!/bin/bash

if [ -z $1 ]; then
  echo "usage: $0 <version>"
  exit 1
fi

version=$1

npm run create_asar
./pack-n-sign.sh
npm run installer:osx
npm run pack:win
npm run installer:win

cd builds

scp Dofucks*$version* RELEASES switool@52.172.219.38:/var/www/updates/releases/win32
ssh switool@52.172.219.38 "mkdir -p /var/www/updates/releases/darwin/$version"
rm Dofucks.zip Dofucks.dmg
zip -r Dofucks.zip Dofucks-darwin-x64
scp Dofucks.zip switool@52.172.219.38:/var/www/updates/releases/darwin/$version

scp Dofucks.dmg switool@52.172.219.38:/var/www/updates/releases/darwin
scp DofucksSetup.exe switool@52.172.219.38:/var/www/updates/releases/win32


cd ..
