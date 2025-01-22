import { ofetch } from "ofetch"

export const apiFetch = ofetch.create({
    baseURL: process.env.NEXT_PUBLIC_API_ROUTE,
    credentials: "include",
    responseType: "json"
})
