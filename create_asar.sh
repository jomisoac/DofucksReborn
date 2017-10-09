#/bin/sh

PATCH_FILE="build/patch"

mkdir -p repo_tmp build

# Copy needed resources to new folder and go into it
cp -r src main.js package.json repo_tmp
cd repo_tmp

# remove client source
rm -rf src/client

# remove development index.html
rm src/browser/index.html

# rename the production index
mv src/browser/index_prod.html src/browser/index.html

# install dependencies
npm install --production
rm -f package-lock.json

# moving back to the root directory, pack with asar
cd ..
asar pack repo_tmp build/app.asar

# get patch version if exist or set it to 1
if [ -e $PATCH_FILE ]; then
	ver=$(cat $PATCH_FILE)
	ver=$((ver+1))
else
	ver=1
fi

# write new patch version
echo -n $ver > $PATCH_FILE

# remove temporary folder repo_tmp
rm -rf repo_tmp

echo "Done."