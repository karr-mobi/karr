import { DB_CONFIG } from "../util/config.ts"
import logger from "../util/logger.ts"

import { drizzle } from "drizzle-orm/postgres-js"

export const connection = {
    host: DB_CONFIG.host, // Postgres ip address[es] or domain name[s]
    port: DB_CONFIG.port, // Postgres server port[s]
    database: DB_CONFIG.name, // Name of database to connect to
    username: DB_CONFIG.user, // Username of database user
    password: DB_CONFIG.password, // Password of database user
    ssl: DB_CONFIG.ssl, // true, prefer, require, tls.connect options
    max: 10, // Max number of connections
    "idle_timeout": 0, // Idle connection timeout in seconds
    "connect_timeout": 30, // Connect timeout in seconds
    prepare: true, // Automatic creation of prepared statements
    //types: [], // Array of custom types, see more below
    "fetch_types": true, // Automatically fetches types on connect
    // on initial connection.
}

logger.debug("Connecting to database", DB_CONFIG)
let conn
try {
    conn = drizzle({ connection })
    logger.info("Connected to database using drizzle-orm")

    // Test the connection
    const result = await conn.execute(
        "SELECT * FROM information_schema.tables WHERE table_name = 'Users';",
    )
    logger.debug("Database connection test result (Users table schema)", result)
} catch (error) {
    logger.error("Failed to connect to database", error)
    Deno.exit(1)
}
export default Object.freeze(conn)
