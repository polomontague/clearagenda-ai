import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Response from "@/lib/Response"
import { NextRequest } from "next/server"

export const POST = (req: NextRequest, props: { params: Promise<{ task_id: string, step_id: string }> }) => {
    try {
        return Response.ok({ cat: "CAT" })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}