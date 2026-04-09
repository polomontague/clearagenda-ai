import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { passwordBodySchema, userParamsSchems } from "@/schemas/users"
import { NextRequest } from "next/server"

export const PUT = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const body = await Request.body(req, passwordBodySchema)
        if (params.user_id !== user.id) throw new HttpError(Response.forbidden())
        const password = (await UsersDAO.getPasswordByUserId(params.user_id))!
        if (!await Auth.comparePasswords({ raw: body.current_password, hashed: password })) throw new HttpError(Response.incorrectCredentials())

        const hashedPassword = await Auth.hashPassword(body.new_password)
        await UsersDAO.updatePassword(params.user_id, hashedPassword)

        return Response.ok()
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}