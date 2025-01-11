import { Suspense } from "react"

import UserInfo from "./userinfo"

export default function AccountPage() {
    return (
        <div>
            <h1>Account</h1>
            <Suspense fallback={<div>Loading User Info...</div>}>
                <UserInfo userid="4e5c65fc-fa9d-4f9e-baee-c4d5914cec93" />
            </Suspense>
        </div>
    )
}
