import { ISSUER } from "@karr/auth/client"
import { APP_URL } from "@karr/config"
import logger from "@karr/logger"
import { lazy } from "@karr/util"

const proxyIsSeparateAuthServer = lazy((): boolean => {
    const appdomain = new URL(APP_URL).hostname
    const authdomain = new URL(ISSUER).hostname

    logger.info(`App domain: ${appdomain}, Auth domain: ${authdomain}`)
    logger.debug("isSeparateAuthServer", authdomain !== appdomain)

    return authdomain !== appdomain
})

/**
 * Check if the auth server is separate from the app server, i.e. if they are hosted on different domains.
 */
export const isSeparateAuthServer = proxyIsSeparateAuthServer.value
