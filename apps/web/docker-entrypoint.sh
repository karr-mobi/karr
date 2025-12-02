#!/bin/sh
set -e

# set the DB variable to the value of the environment variable DB_HOST, or default to db
DB=${DB_HOST:-db}
PORT=${DB_PORT:-3000}

env

echo "Waiting for database..."
wait-for-it.sh $DB:$PORT -t 15

echo "Running database migrations..."
node out/db/migrate.mjs

echo "Starting Next.js server..."
exec node apps/web/server.js
