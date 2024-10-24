import sql from "../util/db.ts"

/**
 * Check if a table exists in the database
 * @param table The name of the table to check
 * @returns A boolean indicating if the table exists
 */
const tableExists = async (table: string) => {
    const result = await sql`
        SELECT to_regclass(${table}) AS exists
    `
    return result[0].exists
}

/**
 * Initialize the user preferences table
 *
 * This table stores user preferences such as whether they travel with music, smoking, pets, etc.
 */
const initUserPrefsTable = async () => {
    // TODO(@finxol): create the users table
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
        CREATE TABLE IF NOT EXISTS users (
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
        CREATE TABLE IF NOT EXISTS accounts (
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
        CREATE TABLE IF NOT EXISTS trips (
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
    if (!tableExists("UserPrefs")) {
        initUserPrefsTable()
    }

    if (!tableExists("SpecialStatus")) {
        initSpecialStatusTable()
    }

    if (!tableExists("Users")) {
        initUsersTable()
    }

    if (!tableExists("Accounts")) {
        initAccountsTable()
    }

    if (!tableExists("Locations")) {
        initLocationsTable()
    }

    if (!tableExists("Trips")) {
        initTripsTable()
    }
}
