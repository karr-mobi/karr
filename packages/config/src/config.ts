import { lazy } from "@karr/util"

import { loadDbConfig, loadFullConfig } from "./loader/index.js"
import { DbConfig } from "./schema.js"

const config = lazy(async () => await loadFullConfig())

export default await config.value

export const {
    APP_URL,
    API_PORT,
    API_BASE,
    LOG_TIMESTAMP,
    LOG_LEVEL,
    ADMIN_EMAIL,
    AUTH_PROVIDERS,
    FEDERATION,
    FEDERATION_TARGETS,
    APPLICATION_NAME,
    PRODUCTION
} = await config.value

export { logLevels } from "./schema.js"
export type { AuthProvider } from "./schema.js"

// ====================================================================
// Database config
// ====================================================================

/**
 * Returns the database config
 * @returns The database config
 */
export async function getDbConfig(): Promise<DbConfig> {
    return loadDbConfig()
}
