#! /bin/sh

## Move files appropriately
mkdir -p .prod

cp -r .next/standalone/* ./.prod

mkdir -p ./.prod/apps/web/.next/static
cp -r .next/static ./.prod/apps/web/.next

mkdir -p ./.prod/apps/web/public
cp -r public ./.prod/apps/web

# Deno needs the explicit .cjs extension to interpret the file as CommonJS
mv ./.prod/apps/web/server.js ./.prod/apps/web/server.cjs
