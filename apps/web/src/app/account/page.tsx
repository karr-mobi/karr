import { API_VERSION } from "@karr/config"

import UserInfo from "./userinfo"

export default function AccountPage() {
    return (
        <div>
            <h1>Account</h1>
            <UserInfo apiVersion={API_VERSION} />
        </div>
    )
}
