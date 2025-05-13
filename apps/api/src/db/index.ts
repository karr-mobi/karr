import process from "node:process"
import { getDbConfig } from "@karr/config"
import logger from "@karr/logger"
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js"

const config = await getDbConfig()

const connection = {
    host: config.host, // Postgres ip address[es] or domain name[s]
    port: config.port, // Postgres server port[s]
    database: config.name, // Name of database to connect to
    username: config.user, // Username of database user
    password: config.password, // Password of database user
    ssl: config.ssl, // true, prefer, require, tls.connect options
    max: 10, // Max number of connections
    idle_timeout: 0, // Idle connection timeout in seconds
    connect_timeout: 30, // Connect timeout in seconds
    prepare: true, // Automatic creation of prepared statements
    //types: [], // Array of custom types, see more below
    fetch_types: true // Automatically fetches types on connect
}

let db: PostgresJsDatabase
try {
    db = drizzle({ connection })

    // Test the connection
    await db.execute(
        "SELECT * FROM information_schema.tables WHERE table_name = 'Users';"
    )
} catch (err) {
    logger.error(err)
    process.exit(1)
}

export { db }
export default db
