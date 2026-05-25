import Validation from "@/lib/Validation"
import z from "zod"
import { fixedRepeat } from "./fixedRepeat"

const onceEventBodySchema = z.object({
    occurs: z.literal("once", 'occurs must be "once" or "repeating"'),
    name: z.string("name must be a string").trim().min(1, "name must be 1 or more characters"),
    notes: z.string("notes must be a string").trim().min(1, "notes must be 1 or more characters").optional(),
    starts: z.string("starts must be a string").trim().refine(value => Validation.isoDateTime(value), "starts must be a valid ISO 8601 datetime"),
    duration: z.number("duration must be a number").min(1, "duration must be 1 or greater"),
    timezone: z.string("timezone must be a string").refine(value => Validation.timezone(value), "timezone must be a valid timezone"),
})

const repeatingEventBodySchema = z.object({
    occurs: z.literal("repeating", 'occurs must be "once" or "repeating"'),
    name: z.string("name must be a string").trim().min(1, "name must be 1 or more characters"),
    notes: z.string("notes must be a string").trim().min(1, "notes must be 1 or more characters").optional(),
    starts: z.string("starts must be a string").trim().refine(value => Validation.time(value), "starts must be a valid time"),
    duration: z.number("duration must be a number").min(1, "duration must be 1 or greater"),
    timezone: z.string("timezone must be a string").refine(value => Validation.timezone(value), "timezone must be a valid timezone"),
    repeat: fixedRepeat
})

export const eventBodySchema = z.discriminatedUnion("occurs", [
    onceEventBodySchema,
    repeatingEventBodySchema
], 'occurs must be "once" or "repeating"')

export const eventParamsSchema = z.object({
    event_id: z.coerce.number("event_id must be a string").min(1, "event_id must be 1 or greater")
})