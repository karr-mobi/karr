#!/bin/sh
set -e

# set the DB variable to the value of the environment variable DB_HOST, or default to db
DB=${DB_HOST:-db}
PORT=${DB_PORT:-3000}

echo "DB=$DB_HOST ; PORT=$DB_PORT"

# check if env has SKIP_WAIT_DB set
if [ -z "$SKIP_WAIT_DB" ]; then
    echo "Waiting for database..."
    wait-for-it.sh $DB:$PORT -t 15
fi

echo "Running database migrations..."
node out/db/migrate.mjs

echo "Starting Next.js server..."
exec node apps/web/server.js
