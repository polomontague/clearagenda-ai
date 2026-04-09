import TasksDAO from "@/dao/TasksDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { taskParamsSchema } from "@/schemas/tasks"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, taskParamsSchema)
        const task = await TasksDAO.getTaskById(params.task_id)
        if (!task) throw new HttpError(Response.notFound())
        if (task.type === "complex") throw new HttpError(Response.taskHasSteps())
        if (user.id !== task.user.id) throw new HttpError(Response.forbidden())
        
        let completed = task.completed
        if (!completed) completed = await TasksDAO.updateTaskCompleted(params.task_id, new Date())

        return Response.ok({ completed })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}