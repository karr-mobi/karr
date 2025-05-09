import { hcWithType } from "@karr/api/client"
import { ofetch } from "ofetch"

export const apiFetch = ofetch.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    credentials: "include",
    responseType: "json"
})

export const client = hcWithType(process.env.NEXT_PUBLIC_API_BASE || "", {
    init: {
        credentials: "include"
    }
})
