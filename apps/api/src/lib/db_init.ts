// /!\ DO NOT USE AS-IS  /!\
// TODO(@finxol): remake db initialisation logic
// 05/11/2024: This isn't up to date, won't behave properly

import postgres from "postgres"
import sql, { connection } from "../lib/db_conn.ts"
import logger from "@util/logger.ts"

/**
 * Check if the database is initialised
 * @returns A boolean indicating if the database is initialised
 */
export const dbExists = async () => {
    logger.debug("Checking if database exists")
    const { database, ...tmpConfig } = connection
    const tmpSql = postgres("", tmpConfig)
    const result = await tmpSql`
        SELECT EXISTS (
            SELECT datname
            FROM pg_catalog.pg_database
            WHERE datname = ${database}
        ) AS exists;
    `
    logger.debug(`Database exists: ${result[0].exists}`)
    return result[0].exists
}

/**
 * Create the database if it does not exist
 */
export const createDb = async () => {
    logger.debug("Creating database")
    const { database, ...tmpConfig } = connection
    const tmpSql = postgres("", tmpConfig)
    await tmpSql`CREATE DATABASE ${database}`
    logger.info("Database created")
}

/**
 * Check if the database has been initialised
 * @returns True if the database is initialised
 */
export const isInitialised = async (): Promise<boolean> => {
    const { tableExists } = await import("../lib/db_init.ts")

    if (!(await dbExists())) {
        logger.debug("Database does not exist")
        return false
    }

    logger.debug("Checking if the database is initialised")

    if (!(await tableExists("UserPrefs"))) {
        logger.debug("UserPrefs table does not exist")
        return false
    }

    logger.debug("UserPrefs table exists")

    if (!(await tableExists("SpecialStatus"))) {
        return false
    }

    if (!(await tableExists("Users"))) {
        return false
    }

    if (!(await tableExists("Accounts"))) {
        return false
    }

    if (!(await tableExists("Locations"))) {
        return false
    }

    if (!(await tableExists("Trips"))) {
        return false
    }

    return true
}

/**
 * Check if a table exists in the database
 * @param table The name of the table to check
 * @returns A boolean indicating if the table exists
 */
export const tableExists = async (table: string): Promise<boolean> => {
    logger.debug(`Checking if table ${table} exists`)
    const result = await sql`
        SELECT EXISTS (
            SELECT *
            FROM information_schema.tables
            WHERE table_name = ${table}
        ) AS exists;
    `
    logger.debug(`Table ${table} exists: ${result[0].exists}`)
    return result[0].exists
}

/**
 * Initialize the user preferences table
 *
 * This table stores user preferences such as whether they travel with music, smoking, pets, etc.
 */
const initUserPrefsTable = async () => {
    // TODO(@finxol): create the users table
    await sql`
        CREATE TABLE IF NOT EXISTS UserPrefs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES Users(id),
            music BOOLEAN DEFAULT FALSE,
            smoking BOOLEAN DEFAULT FALSE,
            pets BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `

    // Check if the table was created
    if (await tableExists("UserPrefs")) {
        logger.info("UserPrefs table created")
    } else {
        logger.error("Failed to create UserPrefs table")
    }
}

/**
 * Initialize the special status table
 *
 * This table stores special statuses such as admin, moderator, CEO, etc.
 */
const initSpecialStatusTable = async () => {
    // TODO(@finxol): create the users table
}

/**
 * Initialize the user table
 *
 * This table stores user information such as name, nickname, phone, bio, etc.
 */
const initUsersTable = async () => {
    // TODO(@finxol): create the users table
    await sql`
        CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `
}

/**
 * Initialize the accounts table
 *
 * This table stores account information such as email, verified status, blocked status, etc.
 */
const initAccountsTable = async () => {
    // TODO(@finxol): create the users table
    await sql`
        CREATE TABLE IF NOT EXISTS Accounts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            balance DECIMAL(10, 2) DEFAULT 0.00,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `
}

/**
 * Initialize the locations table
 *
 * This table stores location information such as name, address, city, state, etc.
 */
const initLocationsTable = async () => {
    // TODO(@finxol): create the users table
}

/**
 * Initialize the trips table
 *
 * This table stores trip information such as driver id, start and end location id, departure time, price, etc.
 */
const initTripsTable = async () => {
    // TODO(@finxol): create the users table
    await sql`
        CREATE TABLE IF NOT EXISTS Trips (
            id SERIAL PRIMARY KEY,
            account_id INTEGER REFERENCES accounts(id),
            amount DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
    `
}

/**
 * Initialize the database
 * Check if the tables exist and create them if they don't
 */
export const dbInit = async () => {
    logger.info("Initialising database...")

    if (!await tableExists("UserPrefs")) {
        logger.info("UserPrefs table does not exist. Creating...")
        await initUserPrefsTable()
        logger.info("✓ UserPrefs table created")
    }

    if (!await tableExists("SpecialStatus")) {
        logger.info("SpecialStatus table does not exist. Creating...")
        await initSpecialStatusTable()
        logger.info("✓ SpecialStatus table created")
    }

    if (!await tableExists("Users")) {
        logger.info("Users table does not exist. Creating...")
        initUsersTable()
        logger.info("✓ Users table created")
    }

    if (!await tableExists("Accounts")) {
        logger.info("Accounts table does not exist. Creating...")
        initAccountsTable()
        logger.info("✓ Accounts table created")
    }

    if (!await tableExists("Locations")) {
        logger.info("Locations table does not exist. Creating...")
        initLocationsTable()
        logger.info("✓ Locations table created")
    }

    if (!await tableExists("Trips")) {
        logger.info("Trips table does not exist. Creating...")
        initTripsTable()
        logger.info("✓ Trips table created")
    }
}
