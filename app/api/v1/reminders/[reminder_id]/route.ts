import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Response from "@/lib/Response"
import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import { reminderParamsSchema } from "@/schemas/reminders"
import RemindersDAO from "@/dao/RemindersDAO"

export const DELETE = async (req: NextRequest, props: { params: Promise<{ reminder_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, reminderParamsSchema)
        const foundReminder = await RemindersDAO.getReminderById(params.reminder_id)
        if (!foundReminder) throw new HttpError(Response.notFound())
        if (user.id !== foundReminder.user.id) throw new HttpError(Response.forbidden())
        
        const reminder = await RemindersDAO.deleteReminder(params.reminder_id)
        return Response.ok({ reminder })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}