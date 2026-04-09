import UsersDAO from "@/dao/UsersDAO"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { registerBodySchema } from "@/schemas/auth"
import { NextRequest } from "next/server"
import Auth from "@/lib/Auth"
import JWT from "@/constants/JWT"

export const POST = async (req: NextRequest) => {
    try {
        const body = await Request.body(req, registerBodySchema)
        const emailUsers = await UsersDAO.getUsers({ email: body.email })
        if (emailUsers.length) throw new HttpError(Response.emailTaken())
        const phoneUsers = await UsersDAO.getUsers({ phone: body.phone })
        if (phoneUsers.length) throw new HttpError(Response.phoneTaken())

        const hashedPassword = await Auth.hashPassword(body.password)
        const user = await UsersDAO.createUser({
            name: {
                first: body.name.first,
                last: body.name.first
            },
            email: body.email,
            phone: body.phone,
            password: hashedPassword
        })
        const expires = JWT.LOGIN_EXPIRES
        const token = Auth.signToken(user, expires)

        return Response.ok({
            user,
            token,
            type: "JWT",
            expires
        })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}