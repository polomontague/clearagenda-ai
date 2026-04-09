import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import { taskBodySchema, taskParamsSchema } from "@/schemas/tasks"
import TasksDAO from "@/dao/TasksDAO"
import AI from "@/lib/AI"
import Auth from "@/lib/Auth"

export const GET = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, taskParamsSchema)
        const task = await TasksDAO.getTaskById(params.task_id)
        if (!task) throw new HttpError(Response.notFound())
        if (user.id !== task.user.id) throw new HttpError(Response.forbidden())
        
        return Response.ok({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const PUT = async (req: NextRequest, props: { params: Promise<{ task_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, taskParamsSchema)
        const body = await Request.body(req, taskBodySchema)
        const currentTask = await TasksDAO.getTaskById(params.task_id)
        if (!currentTask) throw new HttpError(Response.notFound())
        if (user.id !== currentTask.user.id) throw new HttpError(Response.forbidden())
        
        let task
        if ("description" in body) {
            // Complex Task
            const steps = await AI.breakdownTask(body.description)
            const importance = await AI.estimateTaskImportance({
                name: body.name,
                description: body.description
            })

            task = await TasksDAO.updateTask(params.task_id, {
                name: body.name,
                description: body.description,
                steps,
                deadline: body.deadline,
                importance
            })
        } else {
            // Simple Task
            const duration = await AI.estimateTaskDuration(body.name, body.notes)
            const importance = await AI.estimateTaskImportance({
                name: body.name,
                notes: body.notes
            })

            task = await TasksDAO.updateTask(params.task_id, {
                name: body.name,
                notes: body.notes,
                deadline: body.deadline,
                duration,
                importance
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
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, taskParamsSchema)
        const currentTask = await TasksDAO.getTaskById(params.task_id)
        if (!currentTask) throw new HttpError(Response.notFound())
        if (user.id !== currentTask.user.id) throw new HttpError(Response.forbidden())

        const task = await TasksDAO.deleteTask(params.task_id)

        return Response.ok({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}