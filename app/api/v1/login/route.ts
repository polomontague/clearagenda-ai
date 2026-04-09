import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { loginBodySchema } from "@/schemas/auth"
import { NextRequest } from "next/server"
import Validation from "@/lib/Validation"
import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import JWT from "@/constants/JWT"

export const POST = async (req: NextRequest) => {
    try {
        const body = await Request.body(req, loginBodySchema)
        const users = await UsersDAO.getUsers({
            email: Validation.email(body.username) ? body.username : undefined,
            phone: Validation.phone(body.username) ? body.username : undefined
        })
        const user = users.length ? users[0] : undefined
        if (!user) throw new HttpError(Response.incorrectCredentials())
        const password = (await UsersDAO.getPasswordByUserId(user.id))!
        if (!await Auth.comparePasswords({ raw: body.password, hashed: password })) throw new HttpError(Response.incorrectCredentials())
        
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