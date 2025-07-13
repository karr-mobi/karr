import type { UserSubject } from "@karr/auth/subjects"
import logger from "@karr/logger"
import type { Context } from "hono"

/**
 * Get the user subject from the Hono context.
 * Auth is checked before setting the subject in the context.
 */
export function getUserSub(c: Context) {
    // Get the subject from the context
    const subject = c.get("userSubject") as UserSubject | undefined

    logger.debug("User subject", subject)

    // Middleware should prevent this, but good practice to check
    if (!subject?.properties?.id) {
        logger.error("User subject missing in context for GET /user")
        return null
    }

    return subject.properties
}
