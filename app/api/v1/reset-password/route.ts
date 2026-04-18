import JWT from "@/constants/JWT"
import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { resetPasswordBodySchema } from "@/schemas/auth"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const body = await Request.body(req, resetPasswordBodySchema)

        const hashedPassword = await Auth.hashPassword(body.password)
        await UsersDAO.updatePassword(user.id, hashedPassword)
        const expires = JWT.LOGIN_EXPIRES
        const token = Auth.signToken(user, expires)

        return Response.ok({
            user,
            token,
            type: "JWT",
            expires
        })
    } catch(err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}