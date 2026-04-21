import z from "zod"
import Validation from "@/lib/Validation"

export const itemParamsSchema = z.object({
    item_id: z.coerce.number("item_id must be a number").min(1, "item_id must be 1 or greater")
})

const taskBodySchema = z.object({
    type: z.literal("task", 'type must be "task" or "event"'),
    description: z.string("description must be a string").trim().min(1, "description must be 1 or more characters"),
    deadline: z.string("deadline must be a string").trim().refine(value => Validation.dateTime(value), "deadline must be a valid ISO 8601 date time").optional()
})

const eventBodySchema = z.object({
    type: z.literal("event", 'type must be "task" or "event"'),
    name: z.string("name must be a string").trim().min(1, "name must be 1 or more characters"),
    notes: z.string("notes must be a string").trim().min(1, "notes must be 1 or more characters").optional(),
    starts: z.string("starts must be a string").trim().refine(value => Validation.dateTime(value), "starts must be a valid ISO 8601 datetime"),
    ends: z.string("ends must be a string").trim().refine(value => Validation.dateTime(value), "ends must be a valid ISO 8601 datetime")
}).refine(value => new Date(value.ends).getTime() > new Date(value.starts).getTime(), "starts must be before ends")

export const itemBodySchema = z.discriminatedUnion("type", [ taskBodySchema, eventBodySchema ], 'type must be "task" or "event"')

export const itemStepParamsSchema = z.object({
    item_id: z.coerce.number("item_id must be a number").min(1, "item_id must be 1 or greater"),
    step_id: z.coerce.number("step_id must be a number").min(1, "step_id must be 1 or greater")
})