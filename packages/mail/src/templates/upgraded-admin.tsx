import { Heading, Link, Text } from "@react-email/components"
//biome-ignore lint/correctness/noUnusedImports: need to import react for react-email to work
import React from "react"
import BaseTemplate from "./base"

interface UpgradedAdminTemplateProps {
    APP_URL: string
    APPLICATION_NAME: string
    SUPPORT_EMAIL?: string | undefined
}

export function UpgradedAdminTemplate({
    APP_URL,
    APPLICATION_NAME,
    SUPPORT_EMAIL
}: UpgradedAdminTemplateProps) {
    return (
        <BaseTemplate APPLICATION_NAME={APPLICATION_NAME} APP_URL={APP_URL}>
            <Heading className="font-normal text-4xl text-stone-800">
                Congratulations!
            </Heading>
            <Text>
                You were just upgraded to administrator of {APPLICATION_NAME}!
            </Text>
            <Text>
                You now have access to the{" "}
                <Link href={`${APP_URL}/en/admin`} className="underline">
                    administrator dashboard
                </Link>{" "}
                to manage users on this instance.
            </Text>

            {SUPPORT_EMAIL ? (
                <Text>
                    Please feel free to reach out to us at{" "}
                    <Link
                        href={`mailto:${SUPPORT_EMAIL}`}
                        className="underline"
                    >
                        {SUPPORT_EMAIL}
                    </Link>{" "}
                    if you encounter any issues.
                </Text>
            ) : undefined}
        </BaseTemplate>
    )
}

UpgradedAdminTemplate.PreviewProps = {
    APP_URL: "http://localhost",
    APPLICATION_NAME: "Karr Email Preview",
    SUPPORT_EMAIL: "support@karr.mobi"
} as UpgradedAdminTemplateProps

export default UpgradedAdminTemplate
