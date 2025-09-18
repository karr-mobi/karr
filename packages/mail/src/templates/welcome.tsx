import { Heading, Link, Text } from "@react-email/components"
//biome-ignore lint/correctness/noUnusedImports: need to import react for react-email to work
import React from "react"
import BaseTemplate from "./base"

interface WelcomeTemplateProps {
    name: string
    APP_URL: string
    APPLICATION_NAME: string
}

export function WelcomeTemplate({
    name,
    APP_URL,
    APPLICATION_NAME
}: WelcomeTemplateProps) {
    return (
        <BaseTemplate APPLICATION_NAME={APPLICATION_NAME} APP_URL={APP_URL}>
            <Heading className="font-normal text-4xl text-stone-800">
                Hi {name}!
            </Heading>
            <Text>
                Thank you for joining {APPLICATION_NAME}. We're excited to have
                you on board!
            </Text>
            <Text>
                To get started, you can{" "}
                <Link
                    href={`${APP_URL}/account?edit=true`}
                    className="underline"
                >
                    adjust your profile settings
                </Link>
                , and start{" "}
                <Link href={`${APP_URL}/trips/search`} className="underline">
                    finding trips
                </Link>
                !
            </Text>

            <Text>
                Please feel free to reach out to us at{" "}
                <Link href="mailto:support@karr.mobi" className="underline">
                    support@karr.mobi
                </Link>{" "}
                if you encounter any issues.
            </Text>

            <Text className="text-stone-500">
                Best regards,
                <br />
                The {APPLICATION_NAME} Team
            </Text>
        </BaseTemplate>
    )
}

WelcomeTemplate.PreviewProps = {
    name: "Andrew",
    APP_URL: "http://localhost",
    APPLICATION_NAME: "Karr Email Preview"
} as WelcomeTemplateProps

export default WelcomeTemplate
