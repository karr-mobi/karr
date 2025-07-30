import type { Prettify } from "@karr/util"
import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import type { accountsTable } from "@/api/db/schemas/accounts"
import type { specialStatusTable } from "@/api/db/schemas/specialstatus"
import type { userPrefsTable } from "@/api/db/schemas/userprefs"
import type { usersTable } from "@/api/db/schemas/users"

export type AppVariables = {
    userSubject?: UserSubject
    // Add other context variables here if needed
}

export type DataResponse<T> = {
    timestamp?: number
    data: T
}

export interface ErrorResponse {
    message: string
    cause?: string | unknown
}

export type Response<T> = Prettify<DataResponse<T | object> | ErrorResponse>

export type SpecialStatus = InferSelectModel<typeof specialStatusTable>
export type SpecialStatusInsert = Omit<
    InferInsertModel<typeof specialStatusTable>,
    "id"
>

export type UserPrefs = InferSelectModel<typeof userPrefsTable>
export type UserPrefsInsert = Omit<
    InferInsertModel<typeof userPrefsTable>,
    "id"
>

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

//biome-ignore-start lint/style/useNamingConvention: not controled by us
interface Prices {
    e10: string
    s98: string
    s95: string
    e85: string
    gazplus: string
    gaz: string
    gpl: string
}

interface PetroleumPrice {
    date: string
    prix_dollar: string
    prix_euro: string
    percent_change: string
}

export interface ZagazData {
    "@xmlns": string
    "@xml:lang": string
    "@lang": string
    prix_moyen: Prices
    prix_petrole: PetroleumPrice
}
//biome-ignore-end lint/style/useNamingConvention: not controled by us
