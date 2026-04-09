import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { accentBodySchema, userParamsSchems } from "@/schemas/users"
import { NextRequest } from "next/server"

export const PUT = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const body = await Request.body(req, accentBodySchema)
        if (params.user_id !== user.id) throw new HttpError(Response.forbidden())
        
        const accent = await UsersDAO.updateAccent(params.user_id, body.accent)

        return Response.ok({ accent })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}