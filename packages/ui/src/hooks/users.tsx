export function useDisplayName({
    nickname,
    firstName,
    lastName
}: {
    nickname?: string | null
    firstName?: string | null
    lastName?: string | null
}) {
    return nickname || `${firstName || ""} ${lastName || ""}`.trim() || "User"
}

export function useInitials({
    nickname,
    firstName,
    lastName,
    driver
}: {
    nickname?: string | null
    firstName?: string | null
    lastName?: string | null
    driver?: string | null
}) {
    return (
        nickname?.slice(0, 2).toUpperCase() ||
        `${firstName?.charAt(0).toUpperCase()}${lastName?.charAt(0).toUpperCase()}` ||
        driver?.split("-")[0] ||
        "U"
    )
}
