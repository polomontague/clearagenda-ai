import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import ItemsDAO from "@/dao/ItemsDAO"
import { itemBodySchema } from "@/schemas/items"
import AI from "@/lib/AI"
import Auth from "@/lib/Auth"
import { Items } from "openai/resources/conversations.mjs"

export const POST = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const body = await Request.body(req, itemBodySchema)

        let item
        if (body.type === "task") {
            const data = await AI.plan(user.id, body.description)
            if (body.occurs === "once") {
                item = await ItemsDAO.createItem({
                    user_id: user.id,
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
                item = await ItemsDAO.createItem({
                    user_id: user.id,
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
                item = await ItemsDAO.createItem({
                    user_id: user.id,
                    type: body.type,
                    name: body.name,
                    notes: body.notes,
                    starts: body.starts,
                    duration: body.duration,
                    occurs: body.occurs
                })
            }
            if (body.occurs === "repeating") {
                item = await ItemsDAO.createItem({
                    user_id: user.id,
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

        return Response.created({ item })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)

        const items = await ItemsDAO.getItems({ user_id: user.id })

        return Response.ok({ items })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}