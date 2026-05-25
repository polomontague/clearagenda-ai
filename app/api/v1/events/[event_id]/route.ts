import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Response from "@/lib/Response"
import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import { eventBodySchema, eventParamsSchema } from "@/schemas/events"
import EventsDAO from "@/dao/EventsDAO"


export const PUT = async (req: NextRequest, props: { params: Promise<{ event_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, eventParamsSchema)
        const body = await Request.body(req, eventBodySchema)
        const foundEvent = await EventsDAO.getEventById(params.event_id)
        if (!foundEvent) throw new HttpError(Response.notFound())
        if (user.id !== foundEvent.user.id) throw new HttpError(Response.forbidden())
        
        let event
        if (body.occurs === "once") {
            event = await EventsDAO.updateEvent(params.event_id, {
                occurs: "once",
                name: body.name,
                notes: body.notes,
                starts: body.starts,
                duration: body.duration,
                timezone: body.timezone
            })
        } else if (body.occurs === "repeating") {
            event = await EventsDAO.updateEvent(params.event_id, {
                occurs: "repeating",
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

export const DELETE = async (req: NextRequest, props: { params: Promise<{ event_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, eventParamsSchema)
        const foundEvent = await EventsDAO.getEventById(params.event_id)
        if (!foundEvent) throw new HttpError(Response.notFound())
        if (user.id !== foundEvent.user.id) throw new HttpError(Response.forbidden())
        
        const event = await EventsDAO.deleteEvent(params.event_id)
        return Response.ok({ event })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}