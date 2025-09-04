const DEFAULT_USERNAME = "User"

export function useDisplayName(
    user:
        | {
              nickname?: string | null
              firstName?: string | null
              lastName?: string | null
          }
        | undefined
) {
    if (!user) return DEFAULT_USERNAME

    const { nickname, firstName, lastName } = user

    return (
        nickname ||
        `${firstName || ""} ${lastName || ""}`.trim() ||
        DEFAULT_USERNAME
    )
}

export function useInitials(
    user:
        | {
              nickname?: string | null
              firstName?: string | null
              lastName?: string | null
              driver?: string | null
          }
        | undefined
) {
    if (!user) return DEFAULT_USERNAME.at(0)

    const { nickname, firstName, lastName, driver } = user

    return (
        nickname?.slice(0, 2).toUpperCase() ||
        `${firstName?.charAt(0).toUpperCase()}${lastName?.charAt(0).toUpperCase()}` ||
        driver?.split("-")[0] ||
        DEFAULT_USERNAME.at(0)
    )
}
