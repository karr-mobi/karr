import { ofetch } from "ofetch"

export const apiFetch = ofetch.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE,
    credentials: "include",
    responseType: "json"
})
