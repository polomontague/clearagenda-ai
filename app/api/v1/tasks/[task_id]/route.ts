import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import { taskBodySchema, taskParamsSchema } from "@/schemas/tasks"
import TasksDAO from "@/dao/TasksDAO"
import AI from "@/lib/AI"

export const GET = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const params = await Request.params(props, taskParamsSchema)

        const task = await TasksDAO.getTaskById(params.task_id)
        
        return Response.ok({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const PUT = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const params = await Request.params(props, taskParamsSchema)
        const body = await Request.body(req, taskBodySchema)

        let task
        if ("description" in body) {
            // Complex Task
            const steps = await AI.breakdownTask(body.description)

            task = await TasksDAO.updateTask(params.task_id, {
                name: body.name,
                description: body.description,
                steps
            })
        } else {
            const duration = await AI.estimateTaskDuration(body.name, body.notes)
            task = await TasksDAO.updateTask(params.task_id, {
                name: body.name,
                notes: body.notes,
                duration
            })
        }

        return Response.ok({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const DELETE = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const params = await Request.params(props, taskParamsSchema)
        if (!(await TasksDAO.getTaskById(params.task_id))) throw new HttpError(Response.notFound())

        const task = await TasksDAO.deleteTask(params.task_id)

        return Response.ok({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}