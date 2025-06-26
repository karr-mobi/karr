import { hcWithType } from "@karr/api/client"
import { ofetch } from "ofetch"

//biome-ignore lint: I need
const API_BASE = process.env.NEXT_PUBLIC_API_BASE as string
//biome-ignore lint: I need
const APP_URL = process.env.NEXT_PUBLIC_APP_URL as string

console.log("API_BASE", API_BASE)

export const apiFetch = ofetch.create({
    baseURL: new URL(API_BASE, APP_URL).toString(),
    credentials: "include",
    responseType: "json"
})

export const client = hcWithType(API_BASE || "", {
    init: {
        credentials: "include"
    }
})
