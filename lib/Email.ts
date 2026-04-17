import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "",
    port: parseInt(process.env.SMTP_PORT ?? ""),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
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