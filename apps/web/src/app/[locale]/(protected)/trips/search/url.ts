import "server-only"

import { API_BASE, APP_URL } from "@karr/config"

export const url = new URL(`${API_BASE}/trips/search`, APP_URL).href
