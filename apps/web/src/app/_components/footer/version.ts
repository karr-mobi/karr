import "server-only"

import { PRODUCTION } from "@karr/config"
import { APP_VERSION } from "@karr/util/version"

export const version = APP_VERSION
export const isProduction = PRODUCTION
