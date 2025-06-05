import { RESEND_API_KEY } from "@karr/config"
import { Resend } from "resend"

const resend = new Resend(RESEND_API_KEY)

export function sendEmail(to: string, subject: string, text: string) {
    return resend.emails.send({
        from: "Karr <noreply@updates.karr.mobi>",
        to,
        subject,
        text
    })
}
