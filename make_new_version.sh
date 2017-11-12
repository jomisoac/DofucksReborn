#!/bin/bash

if [ -z $1 ]; then
  echo "usage: $0 <version>"
  exit 1
fi

version=$1

function check_error {
  if [ $? -ne 0 ]; then
    echo "Aborting due to error"
    exit 1
  fi
}

rm builds/Dofucks.zip builds/Dofucks.dmg

npm run create_asar
check_error
./pack_n_sign.sh
check_error
npm run installer:osx
check_error
npm run pack:win
check_error
npm run installer:win
check_error

cd builds

zip -r Dofucks.zip Dofucks-darwin-x64
scp Dofucks-$version* RELEASES switool@52.172.219.38:/var/www/updates/releases/win32
ssh switool@52.172.219.38 "mkdir -p /var/www/updates/releases/darwin/$version"
scp Dofucks.zip switool@52.172.219.38:/var/www/updates/releases/darwin/$version
scp Dofucks.dmg switool@52.172.219.38:/var/www/updates/releases/darwin
scp DofucksSetup.exe switool@52.172.219.38:/var/www/updates/releases/win32


cd ..
