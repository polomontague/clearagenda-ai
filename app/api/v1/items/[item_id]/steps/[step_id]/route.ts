import ItemsDAO from "@/dao/ItemsDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { itemStepParamsSchema } from "@/schemas/items"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest, props: { params: Promise<{ task_id: string, step_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, itemStepParamsSchema)
        const item = await ItemsDAO.getItemById(params.item_id)
        if (!item) throw new HttpError(Response.notFound())
        const step = item.steps.find(step => step.id === params.step_id)
        if (!step) throw new HttpError(Response.notFound())
        if (user.id !== item.user.id) throw new HttpError(Response.forbidden())

        let completed = step.completed
        if (!completed) completed = await ItemsDAO.updateCompleted(params.step_id)
        
        return Response.ok({ completed })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}