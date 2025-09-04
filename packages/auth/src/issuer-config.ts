import { APP_URL, AUTH_ISSUER } from "@karr/config"
import logger from "@karr/logger"
import { lazy } from "@karr/util"

/**
 * The domain of the OpenAuth issuer
 */
export const ISSUER_DOMAIN = AUTH_ISSUER
    ? new URL(AUTH_ISSUER).origin
    : new URL(APP_URL).origin

const proxyIsSeparateAuthServer = lazy((): boolean => {
    const appdomain = new URL(APP_URL).hostname
    const authdomain = new URL(ISSUER_DOMAIN).hostname

    logger.info(`App domain: ${appdomain}, Auth domain: ${authdomain}`)
    logger.debug("isSeparateAuthServer", authdomain !== appdomain)

    return authdomain !== appdomain
})

/**
 * Check if the auth server is separate from the app server, i.e. if they are hosted on different domains.
 */
export const isSeparateAuthServer = proxyIsSeparateAuthServer.value

export const embedBasePath = "/api/v1/auth"

export const basePath =
    isSeparateAuthServer && AUTH_ISSUER
        ? new URL(AUTH_ISSUER).pathname.replace(/\/$/, "")
        : embedBasePath

/**
 * The OpenAuth issuer url
 */
export const ISSUER = new URL(basePath, ISSUER_DOMAIN).href.replace(/\/$/, "")
