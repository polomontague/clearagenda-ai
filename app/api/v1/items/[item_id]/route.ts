import ItemsDAO from "@/dao/ItemsDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { itemParamsSchema } from "@/schemas/items"
import { NextRequest } from "next/server"

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