import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Link,
    pixelBasedPreset,
    Tailwind
} from "@react-email/components"
import type { JSX } from "react"
//biome-ignore lint/correctness/noUnusedImports: need to import react for react-email to work
import React from "react"

interface BaseTemplateProps {
    children: JSX.Element[] | JSX.Element
    APP_URL: string
    APPLICATION_NAME: string
}

export function BaseTemplate({
    children,
    APP_URL,
    APPLICATION_NAME
}: BaseTemplateProps) {
    return (
        <Html>
            <Head />
            <Body style={main}>
                <Tailwind
                    config={{
                        presets: [pixelBasedPreset]
                    }}
                >
                    <Container style={container}>
                        <Img
                            src={`${APP_URL}/logo-tmp.jpg`}
                            width="42"
                            height="42"
                            alt={APPLICATION_NAME}
                            style={logo}
                        />
                        {children}
                        <Hr style={hr} />
                        <Link href={APP_URL} style={reportLink}>
                            {APPLICATION_NAME}
                        </Link>
                    </Container>
                </Tailwind>
            </Body>
        </Html>
    )
}

BaseTemplate.PreviewProps = {
    children: [],
    APP_URL: "http://localhost",
    APPLICATION_NAME: "Karr Email Preview"
} as BaseTemplateProps

export default BaseTemplate

const logo = {
    borderRadius: 10,
    width: 42,
    height: 42
}

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
    margin: "0 auto",
    padding: "20px 10px 48px",
    maxWidth: "560px"
}

const reportLink = {
    fontSize: "14px",
    color: "#b4becc",
    textDecoration: "underline"
}

const hr = {
    borderColor: "#dfe1e4",
    margin: "42px 0 26px"
}
