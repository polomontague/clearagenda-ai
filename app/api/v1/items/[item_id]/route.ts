import ItemsDAO from "@/dao/ItemsDAO"
import AI from "@/lib/AI"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { itemBodySchema, itemParamsSchema } from "@/schemas/items"
import { NextRequest } from "next/server"

export const PUT = async (req: NextRequest, props: { params: Promise<{ item_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, itemParamsSchema)
        const body = await Request.body(req, itemBodySchema)
        const foundItem = await ItemsDAO.getItemById(params.item_id)
        if (!foundItem) throw new HttpError(Response.notFound())
        if (user.id !== foundItem.user.id) throw new HttpError(Response.forbidden())
        
        let item
        if (body.type === "task" && foundItem.type === "task") {
            // Only use AI again if description has changed
            const data = body.description !== foundItem.description ? await AI.plan(user.id, body.description) : {
                name: foundItem.name,
                steps: foundItem.steps,
                importance: foundItem.importance
            }
             if (body.occurs === "once") {
                item = await ItemsDAO.updateItem(params.item_id, {
                    type: body.type,
                    name: data.name,
                    description: body.description,
                    steps: data.steps,
                    importance: data.importance,
                    occurs: body.occurs,
                    deadline: body.deadline
                })
            }
            if (body.occurs === "repeating") {
                item = await ItemsDAO.updateItem(params.item_id, {
                    type: body.type,
                    name: data.name,
                    description: body.description,
                    steps: data.steps,
                    importance: data.importance,
                    occurs: body.occurs,
                    repeat: body.repeat
                })
            }
        } else if (body.type === "event") {
            if (body.occurs === "once") {
                item = await ItemsDAO.updateItem(params.item_id, {
                    type: body.type,
                    name: body.name,
                    notes: body.notes,
                    starts: body.starts,
                    duration: body.duration,
                    occurs: body.occurs
                })
            }
            if (body.occurs === "repeating") {
                item = await ItemsDAO.updateItem(params.item_id, {
                    type: body.type,
                    name: body.name,
                    notes: body.notes,
                    starts: body.starts,
                    duration: body.duration,
                    occurs: body.occurs,
                    repeat: body.repeat
                })
            }
        }

        return Response.ok({ item })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const DELETE = async (req: NextRequest, props: { params: Promise<{ item_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, itemParamsSchema)
        const foundItem = await ItemsDAO.getItemById(params.item_id)
        if (!foundItem) throw new HttpError(Response.notFound())
        if (user.id !== foundItem.user.id) throw new HttpError(Response.forbidden())
        
        const item = await ItemsDAO.deleteItem(params.item_id)

        return Response.ok({ item })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}