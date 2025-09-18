import { Heading, Text } from "@react-email/components"
//biome-ignore lint/correctness/noUnusedImports: need to import react for react-email to work
import React from "react"
import { BaseTemplate } from "./base"

interface ConfirmationCodeTemplateProps {
    validationCode: string
    APP_URL: string
    APPLICATION_NAME: string
}

export const ConfirmationCodeTemplate = ({
    validationCode,
    APP_URL,
    APPLICATION_NAME
}: ConfirmationCodeTemplateProps) => (
    <BaseTemplate APPLICATION_NAME={APPLICATION_NAME} APP_URL={APP_URL}>
        {/* TODO: Localize */}
        <Heading style={heading}>
            Your login code for {APPLICATION_NAME}
        </Heading>
        <Text style={paragraph}>
            This code will only be valid for the next 5 minutes.
        </Text>
        <code style={code}>{validationCode}</code>
    </BaseTemplate>
)

ConfirmationCodeTemplate.PreviewProps = {
    validationCode: "123456",
    APP_URL: "http://localhost",
    APPLICATION_NAME: "Karr Email Preview"
} as ConfirmationCodeTemplateProps

export default ConfirmationCodeTemplate

const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "400",
    color: "#484848",
    padding: "17px 0 0"
}

const paragraph = {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149"
}

const code = {
    fontFamily: "monospace",
    fontWeight: "700",
    padding: "1px 4px",
    backgroundColor: "#dfe1e4",
    letterSpacing: "-0.3px",
    fontSize: "21px",
    borderRadius: "4px",
    color: "#3c4149"
}
