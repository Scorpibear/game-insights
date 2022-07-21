#!/usr/bin/env sh

# script to deploy to scorpibear.github.io/game-insights via github pages

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# replace /img with /game-insights/img
find assets/*.js -exec sed -i 's/\/img/\/game-insights\/img/' {} +
sed -i 's/\/assets/\/game-insights\/assets/' index.html

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Scorpibear/game-insights.git main:gh-pages

cd -