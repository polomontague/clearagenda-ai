import z from "zod"
import Validation from "@/lib/Validation"

export const taskParamsSchema = z.object({
    task_id: z.coerce.number("task_id must be a number").min(1, "task_id must be 1 or greater")
})

const simpleTaskBodySchema = z.object({
    name: z.string("name must be a string").min(1, "name must be 1 or more characters"),
    notes: z.string("notes must be a string").min(1, "notes must be 1 or more characters").optional(),
    deadline: z.string("deadline must be a string").refine(value => Validation.dateTime(value), "deadline must be an ISO 8601 date").optional()
}).strict()

const complexTaskBodySchema = z.object({
    name: z.string("name must be a string").min(1, "name must be 1 or more characters"),
    description: z.string("description must be a string").min(1, "description must be 1 or more characters"),
    deadline: z.string("deadline must be a string").refine(value => Validation.dateTime(value), "deadline must be an ISO 8601 date").optional()
}).strict()

export const taskBodySchema = z.union([
    simpleTaskBodySchema,
    complexTaskBodySchema
])

export const taskStepParamsSchema = z.object({
    task_id: z.coerce.number("task_id must be a number").min(1, "task_id must be 1 or greater"),
    step_id: z.coerce.number("step_id must be a number").min(1, "step_id must be 1 or greater")
})