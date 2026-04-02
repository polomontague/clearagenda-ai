import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import { itemParamsSchema } from "@/schemas/items"
import ItemsDAO from "@/dao/Items"

export const GET = async (req: NextRequest, props: { params: Promise<{ item_id: string }> }) => {
    try {
        const params = await Request.params(props, itemParamsSchema)

        const item = await ItemsDAO.getItemById(params.item_id)
        
        return Response.ok({ cat: params.item_id })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}