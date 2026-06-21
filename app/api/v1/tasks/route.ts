import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Request from "@/lib/Request"
import Response from "@/lib/Response"
import { NextRequest } from "next/server"
import { taskBodySchema } from "@/schemas/tasks"
import AI from "@/lib/AI"
import TasksDAO from "@/dao/TasksDAO"

export const POST = async (req: NextRequest) => {
    try {
        const user = await Auth.authenticate(req)
        const body = await Request.body(req, taskBodySchema)

        const data = await AI.plan({
            description: body.description,
            clarity: body.clarity,
            friction: body.friction,
            specifications: body.specifications,
            userId: user.id
        })

        let task
        if (body.occurs === "once") {
            task = await TasksDAO.createTask({
                occurs: "once",
                user_id: user.id,
                name: data.name,
                description: body.description,
                clarity: body.clarity,
                friction: body.friction,
                specifications: body.specifications,
                steps: data.steps,
                importance: data.importance,
                deadline: body.deadline
            })
        } else if (body.occurs === "repeating") {
            task = await TasksDAO.createTask({
                occurs: "repeating",
                user_id: user.id,
                name: data.name,
                description: body.description,
                clarity: body.clarity,
                friction: body.friction,
                specifications: body.specifications,
                steps: data.steps,
                importance: data.importance,
                deadline: body.deadline,
                repeat: body.repeat
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
        const user = await Auth.authenticate(req)

        const tasks = await TasksDAO.getTasks({ user_id: user.id })

        return Response.ok({ tasks })
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}