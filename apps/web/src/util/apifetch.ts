import { hcWithType } from "@karr/api/client"
import { ofetch } from "ofetch"

//biome-ignore lint: I need
const API_BASE = process.env.NEXT_PUBLIC_API_BASE

console.log("API_BASE", API_BASE)

export const apiFetch = ofetch.create({
    baseURL: API_BASE,
    credentials: "include",
    responseType: "json"
})

export const client = hcWithType(API_BASE || "", {
    init: {
        credentials: "include"
    }
})
