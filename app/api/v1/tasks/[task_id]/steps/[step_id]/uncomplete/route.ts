import { NextRequest } from "next/server"
import HttpError from "@/lib/HttpError"
import Response from "@/lib/Response"
import Error from "@/lib/Error"
import Auth from "@/lib/Auth"
import { stepParamsSchema } from "@/schemas/tasks"
import Request from "@/lib/Request"
import { stepBodySchema } from "@/schemas/tasks"
import TasksDAO from "@/dao/TasksDAO"
import { RepeatingStep } from "@/types/Task"

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
        if (user.id !== task.user.id) throw new HttpError(Response.forbidden())
        
        if (task.occurs == "once") {
            await TasksDAO.updateStepCompleted(params.step_id, undefined)
            return Response.ok()
        }
        if (task.occurs === "repeating" && body.date) {
            const completion = (step as RepeatingStep).completions.find(completion => completion.date === body.date)
            if (completion) await TasksDAO.deleteStepCompletion(completion.id)
            return Response.ok()
        }
    } catch (err) {
        if (err instanceof HttpError) return err.response
        Error.notify(err)
        return Response.internalServerError()
    }
}