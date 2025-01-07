import "server-only"

import getAppConfig from "@karr/config"

export default function AppName() {
    return <>{getAppConfig().APPLICATION_NAME}</>
}
