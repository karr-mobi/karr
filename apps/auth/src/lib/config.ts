"use server"

import { APPLICATION_NAME } from "@config"

export async function getApplicationName(): Promise<string> {
    return APPLICATION_NAME
}
