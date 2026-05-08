import z from "zod"
import Validation from "@/lib/Validation"
import { floatingRepeat } from "./floatingRepeat"

const onceTaskBodySchema = z.object({
    occurs: z.literal("once", 'occurs must be "once" or "repeating"'),
    description: z.string("description must be a string").trim().min(1, "description must be 1 or more characters"),
    deadline: z.string("deadline must be a string").trim().refine(value => Validation.date(value), "deadline must be a valid date").optional()
})

const repeatingTaskBodySchema = z.object({
    occurs: z.literal("repeating", 'occurs must be "once" or "repeating"'),
    description: z.string("description must be a string").trim().min(1, "description must be 1 or more characters"),
    deadline: z.number("deadline must be a number").min(1, "deadline must be 1 or greater").optional(),
    repeat: floatingRepeat
})

export const taskBodySchema = z.discriminatedUnion("occurs", [
    onceTaskBodySchema,
    repeatingTaskBodySchema
], 'occurs must be "once" or "repeating"')