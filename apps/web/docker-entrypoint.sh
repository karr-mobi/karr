#!/bin/sh
set -e

echo "Waiting for database..."
wait-for-it.sh db:5432 -t 15

echo "Running database migrations..."
node out/db/migrate.mjs

echo "Starting Next.js server..."
exec node apps/web/server.js
