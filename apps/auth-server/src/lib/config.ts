import { APP_URL, AUTH_ISSUER } from "@karr/config"
import logger from "@karr/logger"
import { lazy } from "@karr/util"

const proxyIsSeparateAuthServer = lazy((): boolean => {
    const appdomain = new URL(APP_URL).hostname
    const authdomain = new URL(AUTH_ISSUER).hostname

    logger.info(`App domain: ${appdomain}, Auth domain: ${authdomain}`)
    logger.debug("isSeparateAuthServer", authdomain !== appdomain)

    return authdomain !== appdomain
})

/**
 * Check if the auth server is separate from the app server, i.e. if they are hosted on different domains.
 */
export const isSeparateAuthServer = proxyIsSeparateAuthServer.value
