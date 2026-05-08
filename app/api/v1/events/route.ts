import EventsDAO from "@/dao/EventsDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { eventBodySchema } from "@/schemas/events"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const body = await Request.body(req, eventBodySchema)

        let event
        if (body.occurs === "once") {
            event = await EventsDAO.createEvent({
                occurs: "once",
                user_id: user.id,
                name: body.name,
                notes: body.notes,
                starts: body.starts,
                duration: body.duration,
                timezone: body.timezone
            })
        } else if (body.occurs === "repeating") {
            event = await EventsDAO.createEvent({
                occurs: "repeating",
                user_id: user.id,
                name: body.name,
                notes: body.notes,
                starts: body.starts,
                duration: body.duration,
                timezone: body.timezone,
                repeat: body.repeat
            })
        }

        return Response.ok({ event })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)

        const events = await EventsDAO.getEvents({ user_id: user.id })

        return Response.ok({ events })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}