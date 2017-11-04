#!/usr/bin/env bash
set -e

source .env.production

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

buffalo bill --ldflags="-s -w"
echo '----> compressing binary'
cd bin
tar czf budgetal.tar.gz budgetal
rm budgetal
cd ..
SIZE=$(du -h bin/budgetal.tar.gz | cut -f1)
echo "----> linux 386 binary compressed in bin/budgetal.tar.gz ($SIZE)"

echo "----> building frontend"
cd frontend
yarn build

echo "----> removing sourcemaps"
rm -rf build/users
rm -f build/static/js/*.map
rm -f build/static/css/*.map
sed -i '' -e '/\/\/# sourceMappingURL.*/d' build/static/js/main*.js
sed -i '' -e '/\/\*# sourceMappingURL.*/d' build/static/css/main*.css

echo "----> compressing frontend"
archive="frontend.tar.gz"
tar czf $archive build
mv $archive ../bin/
cd ..
SIZE=$(du -h bin/$archive | cut -f1)
echo "----> react app compressed in bin/$archive ($SIZE)"
