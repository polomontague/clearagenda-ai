import Auth from "@/lib/Auth"
import Error from "@/lib/Error"
import HttpError from "@/lib/HttpError"
import Response from "@/lib/Response"
import { NextRequest } from "next/server"
import Request from "@/lib/Request"
import { stepBodySchema, stepParamsSchema } from "@/schemas/tasks"
import TasksDAO from "@/dao/TasksDAO"

export const POST = async (req: NextRequest, props: { params: Promise<{ task_id: string, step_id: string }> }) => {
    try {
        const user = await Auth.authenticate(req)
        const params = await Request.params(props, stepParamsSchema)
        const body = await Request.body(req, stepBodySchema)
        const task = await TasksDAO.getTaskById(params.task_id)
        if (!task) throw new HttpError(Response.notFound())
        const step = task.steps.find(step => step.id === params.step_id)
        if (!step) throw new HttpError(Response.childNotFound("Step Does Not Exist"))
        if (task.occurs === "repeating" && !body.date) throw new HttpError(Response.validationError({ date: "date must be a string" }))

        if (task.occurs == "once") {
            const completed = await TasksDAO.updateStepCompleted(params.step_id, new Date().toISOString())
            return Response.ok({ completed })
        }
        if (task.occurs === "repeating" && body.date) {
            const completion = await TasksDAO.createStepCompletion(params.step_id, {
                date: body.date,
                completed: new Date().toISOString()
            })
            return Response.ok({ completion })
        }
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}