"use server"

import { API_BASE, APP_URL } from "@karr/config"
import { ofetch } from "ofetch"

export const apiFetch = ofetch.create({
    baseURL: new URL(API_BASE, APP_URL).toString(),
    credentials: "include",
    responseType: "json"
})
