import type { InferInsertModel, InferSelectModel } from "drizzle-orm"

import type { accountsTable } from "@/db/schemas/accounts"
import type { specialStatusTable } from "@/db/schemas/specialstatus"
import type { userPrefsTable } from "@/db/schemas/userprefs"
import type { usersTable } from "@/db/schemas/users"

export type UserSubject = {
    type: "user"
    properties: {
        userID: string
    }
}

export type AppVariables = {
    userSubject?: UserSubject
    // Add other context variables here if needed
}

export interface DataResponse<T> {
    timestamp?: number
    data: T
}

export interface ErrorResponse {
    timestamp?: number
    contact?: string
    error: {
        message: string
        details?: unknown[]
    }
}

export type Response<T> = DataResponse<T | object> | ErrorResponse

export type SpecialStatus = InferSelectModel<typeof specialStatusTable>
export type SpecialStatusInsert = Omit<InferInsertModel<typeof specialStatusTable>, "id">

export type UserPrefs = InferSelectModel<typeof userPrefsTable>
export type UserPrefsInsert = Omit<InferInsertModel<typeof userPrefsTable>, "id">

export type Users = InferSelectModel<typeof usersTable>
export type UsersInsert = Omit<InferInsertModel<typeof usersTable>, "id">

export type UsersWithPrefs = {
    Users: Users
    UserPrefs: UserPrefs
}

export type UserWithPrefsAndStatus = {
    Users: Users
    UserPrefs: UserPrefs
    SpecialStatus: SpecialStatus
}

export type UserPublicProfile = {
    firstName: string
    nickname?: string
    bio?: string
    specialStatus?: string
}

export type Account = InferSelectModel<typeof accountsTable>
export type AccountInsert = Omit<InferInsertModel<typeof accountsTable>, "id">

export type AccountVerified = {
    verified: boolean
}
