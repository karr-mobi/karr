import { drizzle } from "drizzle-orm/postgres-js"

import { getDbConfig, PRODUCTION } from "@karr/config"

const config = getDbConfig()

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

let db
try {
    if (!PRODUCTION) {
        console.log("Connecting to database...", { connection })
    }

    db = drizzle({ connection })

    // Test the connection
    await db.execute(
        "SELECT * FROM information_schema.tables WHERE table_name = 'Users';"
    )
} catch (err) {
    console.error(err)
    process.exit(1)
}

export default Object.freeze(db)
