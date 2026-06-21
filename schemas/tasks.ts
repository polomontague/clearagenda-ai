import z from "zod"
import Validation from "@/lib/Validation"
import { floatingRepeat } from "./floatingRepeat"

const clarity = z.union([
    z.literal("low"),
    z.literal("medium"),
    z.literal("high"),
], 'clarity must be "low", "medium", or "high"')

const friction = z.array(z.enum([
    "starting",
    "steps",
    "learning",
    "scope",
    "approach",
    "duration"
], 'elements of friction must be "starting", "steps", "learning", "scope", "approach", or "duration"'), "friction must be an array")

const specifications = z.array(z.string("elements of specifications must be a string").trim().min(1, "elements of specifications must be 1 or more characters"), "specifications must be an array")

const onceTaskBodySchema = z.object({
    occurs: z.literal("once", 'occurs must be "once" or "repeating"'),
    description: z.string("description must be a string").trim().min(1, "description must be 1 or more characters"),
    clarity,
    friction,
    specifications,
    deadline: z.string("deadline must be a string").trim().refine(value => Validation.date(value), "deadline must be a valid date").optional()
})

const repeatingTaskBodySchema = z.object({
    occurs: z.literal("repeating", 'occurs must be "once" or "repeating"'),
    description: z.string("description must be a string").trim().min(1, "description must be 1 or more characters"),
    clarity,
    friction,
    specifications,
    deadline: z.number("deadline must be a number").min(1, "deadline must be 1 or greater").optional(),
    repeat: floatingRepeat
})

export const taskBodySchema = z.discriminatedUnion("occurs", [
    onceTaskBodySchema,
    repeatingTaskBodySchema
], 'occurs must be "once" or "repeating"')

export const taskParamsSchema = z.object({
    task_id: z.coerce.number("task_id must be a number").min(1, "task_id must be 1 or greater")
})

export const stepParamsSchema = z.object({
    task_id: z.coerce.number("task_id must be a number").min(1, "task_id must be 1 or greater"),
    step_id: z.coerce.number("step_id must be a number").min(1, "step_id must be 1 or greater")
})

export const stepBodySchema = z.object({
    date: z.string("date must be a string").trim().refine(value => Validation.date(value), "date must be a valid date").optional()
})