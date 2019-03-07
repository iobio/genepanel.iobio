#!/bin/bash

rm -rf deploy
mkdir deploy
mkdir deploy/assets
mkdir deploy/app
mkdir deploy/dist

# build vue app
if [[ $1 == "prod" ]]; then
  echo "** Building prod **"
  NODE_ENV=production npm run build
else
  echo "** Building dev **"
  npm run build
fi

# link to files needed for static page
working_dir=$PWD

ln -s $working_dir/server/views/index.html $working_dir/deploy/index.html
ln -s $working_dir/client/assets $working_dir/deploy/assets
ln -s $working_dir/client/dist/build.js $working_dir/deploy/dist/build.js
if [[ $1 == "prod" ]]; then
  ln -s $working_dir/client/dist/build.js.map $working_dir/deploy/dist/build.js.map
fi

# upload to cloudfront
if [[ $1 == "prod" ]]; then

  echo "** Syncing to genepanel prod s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/prod/genepanel.iobio.io/ --recursive

  echo "** Renew genepanel prod cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E14HSC209IWKWU --paths /\*


else
  echo "** Syncing to dev s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/dev/panel.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E2ZI10KD8X77ZL --paths /\*
fi
