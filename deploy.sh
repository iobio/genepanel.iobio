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
  NODE_ENV=development npm run build
fi

# link to files needed for static page
ln -s ~/desktop/genepanel/server/views/index.html ~/desktop/genepanel/deploy/index.html
ln -s ~/desktop/genepanel/client/assets ~/desktop/genepanel/deploy/assets
ln -s ~/desktop/genepanel/client/dist/build.js ~/desktop/genepanel/deploy/dist/build.js
if [[ $1 == "prod" ]]; then
  ln -s ~/desktop/genepanel/client/dist/build.js.map ~/desktop/genepanel/deploy/dist/build.js.map
fi

# upload to cloudfront
if [[ $1 == "prod" ]]; then
  #aws s3 cp ./deploy/  s3://static.iobio.io/vue.gene.iobio.io/ --recursive
  #aws cloudfront create-invalidation --distribution-id EPK0TTL11YUW --paths /

  echo "** Uploaded to prod s3 bucket **"
  # aws s3 cp ./deploy/  s3://static.iobio.io/prod/gene.iobio.io/ --recursive
  # echo "** Renew cloudfrount cache **"
  # aws cloudfront create-invalidation --distribution-id E331YTF25OIVP7 --paths /\*
  echo "** Syncing to prod s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/dev/panel.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E2ZI10KD8X77ZL --paths /\*



else
  echo "** Syncing to dev s3 bucket **"
  aws s3 cp ./deploy/  s3://static.iobio.io/dev/panel.iobio.io/ --recursive
  echo "** Renew cloudfrount cache **"
  aws cloudfront create-invalidation --distribution-id E2ZI10KD8X77ZL --paths /\*
fi
