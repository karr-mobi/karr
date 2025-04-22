import "server-only"

import packageJson from "../../../../../../package.json" with { type: "json" }
import { PRODUCTION } from "@karr/config"

export const version = packageJson.version
export const isProduction = PRODUCTION
