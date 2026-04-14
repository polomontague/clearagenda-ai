import z from "zod"
import Validation from "@/lib/Validation"

export const itemParamsSchema = z.object({
    item_id: z.coerce.number("item_id must be a number").min(1, "item_id must be 1 or greater")
})
export const itemBodySchema = z.object({
    description: z.string("description must be a string").trim().min(1, "description must be 1 or more characters"),
    deadline: z.string("deadline must be a string").trim().refine(value => Validation.dateTime(value), "deadline must be a valid 8601 date time").optional()
})

export const itemStepParamsSchema = z.object({
    item_id: z.coerce.number("item_id must be a number").min(1, "item_id must be 1 or greater"),
    step_id: z.coerce.number("step_id must be a number").min(1, "step_id must be 1 or greater")
})