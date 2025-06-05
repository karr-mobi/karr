import { lazy } from "@karr/util"

import { loadDbConfig, loadFullConfig } from "./loader/index.js"
import type { DbConfig } from "./schema.js"

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
    RESEND_API_KEY,
    APPLICATION_NAME,
    PRODUCTION
} = await config.value

export type { AuthProvider } from "./schema.js"
//biome-ignore lint/performance/noBarrelFile: much simpler than exporting schema too
export { logLevels } from "./schema.js"

// ====================================================================
// Database config
// ====================================================================

/**
 * Returns the database config
 * @returns The database config
 */
export function getDbConfig(): Promise<DbConfig> {
    return loadDbConfig()
}
