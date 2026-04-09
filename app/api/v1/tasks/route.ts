import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import HttpError from "@/lib/HttpError"
import Error from "@/lib/Error"
import TasksDAO from "@/dao/TasksDAO"
import { taskBodySchema } from "@/schemas/tasks"
import AI from "@/lib/AI"

export const POST = async (req: NextRequest) => {
    try {
        const body = await Request.body(req, taskBodySchema)

        let task
        if ("description" in body) {
            // Complex Task
            const steps = await AI.breakdownTask(body.description)
            const importance = await AI.estimateTaskImportance({
                name: body.name,
                description: body.description
            })

            task = await TasksDAO.createTask({
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
            task = await TasksDAO.createTask({
                name: body.name,
                notes: body.notes,
                duration,
                deadline: body.deadline,
                importance
            })
        }

        return Response.created({ task })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const tasks = await TasksDAO.getTasks()

        return Response.ok({ tasks })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}