import { NextRequest } from "next/server"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import AI from "@/lib/AI"

export const GET = async (req: NextRequest) => {
    try {
        const name = "Call Access HRA"
        const notes = `Office Hours 8:00 AM - 5:00 PM
Update address`
        const duration = await AI.estimateTaskDuration(name, notes)
        return Response.ok({ duration })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}