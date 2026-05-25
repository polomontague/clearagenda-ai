import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Response from "@/lib/Response"
import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import { taskParamsSchema } from "@/schemas/tasks"
import TasksDAO from "@/dao/TasksDAO"

export const DELETE = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, taskParamsSchema)
        const foundTask = await TasksDAO.getTaskById(params.task_id)
        if (!foundTask) throw new HttpError(Response.notFound())
        if (user.id !== foundTask.user.id) throw new HttpError(Response.forbidden())
        
        const task = await TasksDAO.deleteTask(params.task_id)
        return Response.ok({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}