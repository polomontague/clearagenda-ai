import RemindersDAO from "@/dao/RemindersDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { reminderBodySchema } from "@/schemas/reminders"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const body = await Request.body(req, reminderBodySchema)

        let reminder
        if (body.occurs === "once") {
            reminder = await RemindersDAO.createReminder({
                occurs: "once",
                user_id: user.id,
                name: body.name,
                at: body.at
            })
        } else if (body.occurs === "repeating") {
            reminder = await RemindersDAO.createReminder({
                occurs: "repeating",
                user_id: user.id,
                name: body.name,
                at: body.at,
                repeat: body.repeat
            })
        }

        return Response.ok({ reminder })
    } catch(err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        
        const reminders = await RemindersDAO.getReminders({ user_id: user.id })

        return Response.ok({ reminders })
    } catch(err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}