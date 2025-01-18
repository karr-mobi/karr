export function setAuthentication(value: boolean) {
    localStorage.setItem("isAuthenticated", String(value))
    window.dispatchEvent(new Event("auth-change"))
}

export function getAuthentication(): boolean {
    return localStorage.getItem("isAuthenticated") === "true"
}
