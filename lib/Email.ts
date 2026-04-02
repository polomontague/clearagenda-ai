import nodemailer from "nodemailer"
import Emails from "@/constants/Emails"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: Emails.CONTACT,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
})

type SendOptions = {
    from: {
        name: string,
        email: string
    },
    to: {
        name?: string,
        email: string
    },
    replyTo?: {
        name: string,
        email: string
    },
    subject: string,
    message: string
}

const Email = {
    send: async (options: SendOptions) => {
        await transporter.sendMail({
            from: `"${options.from.name}" <${options.from.email}>`,
            to: options.to.name ? `"${options.to.name}" <${options.to.email}>` : options.to.email,
            replyTo: options.replyTo ? `"${options.replyTo.name}" <${options.replyTo.email}>` : undefined,
            subject: options.subject,
            text: options.message
        })
    }
}

export default Email