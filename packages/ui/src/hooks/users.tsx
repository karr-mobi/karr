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
