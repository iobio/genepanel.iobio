#!/bin/bash

rm -rf deploy
mkdir deploy
mkdir deploy/assets
mkdir deploy/app
mkdir deploy/dist

# build vue app
  echo "** Building dev **"
  NODE_ENV=production npm run build

# link to files needed for static page
working_dir=$PWD

ln -s $working_dir/server/views/index.html $working_dir/deploy/index.html
ln -s $working_dir/client/assets $working_dir/deploy/assets
ln -s $working_dir/client/dist/build.js $working_dir/deploy/dist/build.js
ln -s $working_dir/client/dist/build.js.map $working_dir/deploy/dist/build.js.map

# upload to cloudfront
echo "** Syncing to dev s3 bucket **"
aws s3 cp ./deploy/  s3://static.iobio.io/dev/panel.iobio.io/ --recursive
echo "** Renew cloudfrount cache **"
aws cloudfront create-invalidation --distribution-id E2ZI10KD8X77ZL --paths /\*
