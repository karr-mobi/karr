import postgres from "postgres"
import { db } from "../util/config.ts"

const sql = postgres("", {
    host: db.host, // Postgres ip address[es] or domain name[s]
    port: db.port, // Postgres server port[s]
    database: db.name, // Name of database to connect to
    username: db.user, // Username of database user
    password: db.password, // Password of database user
    ssl: db.ssl, // true, prefer, require, tls.connect options
    max: 10, // Max number of connections
    idle_timeout: 0, // Idle connection timeout in seconds
    connect_timeout: 30, // Connect timeout in seconds
    prepare: true, // Automatic creation of prepared statements
    //types: [], // Array of custom types, see more below
    fetch_types: true, // Automatically fetches types on connect
    // on initial connection.
})

export default sql
