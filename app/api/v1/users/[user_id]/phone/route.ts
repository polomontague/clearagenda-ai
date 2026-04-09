import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { phoneBodySchema, userParamsSchems } from "@/schemas/users"
import { NextRequest } from "next/server"

export const PUT = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const body = await Request.body(req, phoneBodySchema)
        const phoneUsers = await UsersDAO.getUsers({ phone: body.phone })
        const phoneUser = phoneUsers.length ? phoneUsers[0] : undefined
        if (phoneUser && phoneUser.id !== user.id) throw new HttpError(Response.phoneTaken())
        if (params.user_id !== user.id) throw new HttpError(Response.forbidden())

        const phone = await UsersDAO.updatePhone(params.user_id, body.phone)

        return Response.ok({ phone })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}