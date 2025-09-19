import { Heading, Link, Text } from "@react-email/components"
//biome-ignore lint/correctness/noUnusedImports: need to import react for react-email to work
import React from "react"
import BaseTemplate from "./base"

interface DowngradedUserTemplateProps {
    APP_URL: string
    APPLICATION_NAME: string
    SUPPORT_EMAIL?: string | undefined
}

export function DowngradedUserTemplate({
    APP_URL,
    APPLICATION_NAME,
    SUPPORT_EMAIL
}: DowngradedUserTemplateProps) {
    return (
        <BaseTemplate APPLICATION_NAME={APPLICATION_NAME} APP_URL={APP_URL}>
            <Heading className="font-normal text-4xl text-stone-800">
                Oh no...!
            </Heading>
            <Text>
                You were just downgraded to a regular user of {APPLICATION_NAME}
                !
            </Text>
            <Text>
                You no longer have access to the administrator dashboard and
                other admin privileges, but you can still enjoy the application
                as a regular user.
            </Text>

            {SUPPORT_EMAIL ? (
                <Text>
                    Was this unintentional? Please reach out to us at{" "}
                    <Link
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="underline"
                    >
                        {SUPPORT_EMAIL}
                    </Link>{" "}
                    to try to resolve the issue.
                </Text>
            ) : undefined}
        </BaseTemplate>
    )
}

DowngradedUserTemplate.PreviewProps = {
    APP_URL: "http://localhost",
    APPLICATION_NAME: "Karr Email Preview",
    SUPPORT_EMAIL: "support@karr.mobi"
} as DowngradedUserTemplateProps

export default DowngradedUserTemplate
