import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { userParamsSchems } from "@/schemas/users"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const authUser = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const user = await UsersDAO.getUserById(params.user_id)
        if (!user) throw new HttpError(Response.notFound())
        if (authUser.id !== user.id) throw new HttpError(Response.forbidden())
        
        return Response.ok({ user })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const DELETE = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const authUser = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const foundUser = await UsersDAO.getUserById(params.user_id)
        if (!foundUser) throw new HttpError(Response.notFound())
        if (authUser.id !== foundUser.id) throw new HttpError(Response.forbidden())

        const user = await UsersDAO.deleteUser(params.user_id)

        return Response.ok({ user })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}