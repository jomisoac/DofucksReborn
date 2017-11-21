#/bin/bash

mkdir -p repo_tmp

# Copy needed resources to new folder and go into it
cp -R src main.js package.json webpack.*.js repo_tmp
cd repo_tmp

# remove development index.html
rm src/browser/index.html

# rename the production index
mv src/browser/index_prod.html src/browser/index.html

# install dependencies
npm install --production
npm run prod

# remove uselss files
rm -rf src/client
rm -rf src/assets/Dofucks.ai
rm -rf src/assets/dofucks.icns
rm -rf src/assets/Dofucks.svg
rm -rf package-lock.json
rm -rf webpack.*.js

# moving back to the root directory, pack with asar
cd ..
#asar pack repo_tmp build/app.asar

# remove temporary folder repo_tmp
#rm -rf repo_tmp

echo "Done."

#    --app-version=$npm_package_version --version-string.CompanyName='Dofucks Reborn' --version-string.FileDescription=$npm_package_productName --version-string.OriginalFilename='Dofucks.exe' --version-string.InternalName=$npm_package_productName --version-string.ProductName=$npm_package_productName --version-string.ProductVersion=$npm_package_version --asar=true --icon=src/assets/dofucks.ico --overwrite",
