import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import Error from "@/lib/Error"
import Request from "@/lib/Request"
import { forgotPasswordSchema } from "@/schemas/auth"
import HttpError from "@/lib/HttpError"
import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import JWT from "@/constants/JWT"
import Email from "@/lib/Email"
import Emails from "@/constants/Emails"

export const POST = async (req: NextRequest) => {
    try {
        const body = await Request.body(req, forgotPasswordSchema)
        const foundUsers = await UsersDAO.getUsers({ email: body.email })
        const user = foundUsers.length ? foundUsers[0] : undefined

        if (user) {
            const token = Auth.signToken(user, JWT.FORGOT_PASSWORD_EXPIRES)

            Email.send({
            from: {
                name: "World of Montague",
                email: Emails.NO_REPLY
            },
            to: {
                name: "",
                email: body.email
            },
            subject: "Reset Password",
            message: `<a href="${process.env.BASE_URL ?? ""}/reset-password?token=${token}">Reset Password</a>`
        })
        }

        return Response.ok()
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}