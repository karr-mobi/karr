export type DbConfig = {
    host: string
    port: number
    ssl: boolean
    name: string
    user: string
    password: string
    connStr: string
}

export type Config = {
    PRODUCTION: boolean
    API_VERSION: string
    API_PORT: number
    DB_CONFIG: Readonly<DbConfig>
    LOG_TIMESTAMP: boolean
    LOG_LEVEL: string
    APPLICATION_NAME: string
    ADMIN_EMAIL: string
}
