import UsersDAO from "@/dao/UsersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { hoursBodySchema, userParamsSchems } from "@/schemas/users"
import { NextRequest } from "next/server"

export const PUT = async (req: NextRequest, props: { params: Promise<{ user_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, userParamsSchems)
        const body = await Request.body(req, hoursBodySchema)
        if (params.user_id !== user.id) throw new HttpError(Response.forbidden())
        
        const hours = await UsersDAO.updatePreferencesHours(params.user_id, {
            sunday: body.sunday,
            monday: body.monday,
            tuesday: body.tuesday,
            wednesday: body.wednesday,
            thursday: body.thursday,
            friday: body.friday,
            saturday: body.saturday
        })

        return Response.ok({ hours })
    } catch(err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}