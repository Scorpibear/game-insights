#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cp -r img/chesspieces/ dist/img/chesspieces/
cd dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Scorpibear/game-insights.git main:gh-pages

cd -