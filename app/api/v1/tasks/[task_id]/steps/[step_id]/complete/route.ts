import TasksDAO from "@/dao/TasksDAO"
import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { taskStepParamsSchema } from "@/schemas/tasks"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest, props: { params: Promise<{ task_id: string, step_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, taskStepParamsSchema)
        const task = await TasksDAO.getTaskById(params.task_id)
        if (!task) throw new HttpError(Response.notFound())
        const step = task.type === "complex" ? task.steps.find(step => step.id === params.step_id) : undefined
        if (!step) throw new HttpError(Response.notFound())
        if (user.id !== task.user.id) throw new HttpError(Response.forbidden())

        let completed = step.completed
        if (!completed) completed = await TasksDAO.updateStepCompleted(params.step_id, new Date())
        
        return Response.ok({ completed })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}