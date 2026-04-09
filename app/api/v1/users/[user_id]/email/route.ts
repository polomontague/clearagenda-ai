import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { emailBodySchema, userParamsSchems } from "@/schemas/users"
import { NextRequest } from "next/server"

export const PUT = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const body = await Request.body(req, emailBodySchema)
        if (params.user_id !== user.id) throw new HttpError(Response.forbidden())
        const emailUsers = await UsersDAO.getUsers({ email: body.email })
        const emailUser = emailUsers .length ? emailUsers[0] : undefined
        if (emailUser && emailUser.id !== user.id) throw new HttpError(Response.emailTaken())

        const email = await UsersDAO.updateEmail(params.user_id, body.email)

        return Response.ok({ email })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}