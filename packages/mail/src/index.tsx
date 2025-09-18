import { RESEND_API_KEY } from "@karr/config"
import type { JSX } from "react"
import { Resend } from "resend"

const resend = new Resend(RESEND_API_KEY)

export function sendRawEmail({
    to,
    subject,
    body
}: {
    to: string
    subject: string
    body: string
}) {
    return resend.emails.send({
        from: "Karr <noreply@updates.karr.mobi>",
        to,
        subject,
        html: `<p>${body}</p>`
    })
}

export function sendEmail<T extends JSX.Element>({
    to,
    subject,
    ...props
}: {
    to: string
    subject: string
    template: T
}) {
    return resend.emails.send({
        from: "Karr <noreply@updates.karr.mobi>",
        to,
        subject,
        react: props.template
    })
}
