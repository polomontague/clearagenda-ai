import z from "zod"
import Validation from "@/lib/Validation"
import { floatingRepeat } from "./floatingRepeat"

const onceReminderBodySchema = z.object({
    occurs: z.literal("once", 'occurs must be "once" or "repeating"'),
    name: z.string("name must be a string").trim().min(1, "name must be 1 or more characters"),
    at: z.string("at must be a string").trim().refine(value => Validation.dateTime(value), "at must be a valid datetime")
})

const repeatingReminderBodySchema = z.object({
    occurs: z.literal("repeating", 'occurs must be "once" or "reminders"'),
    name: z.string("name must be a string").trim().min(1, "name must be 1 or more characters"),
    at: z.string("at must be a string").trim().refine(value => Validation.time(value), "at must be a valid time"),
    repeat: floatingRepeat
})

export const reminderBodySchema = z.discriminatedUnion("occurs", [
    onceReminderBodySchema,
    repeatingReminderBodySchema
], 'occurs must be "once" or "repeating"')

export const reminderParamsSchema = z.object({
    reminder_id: z.coerce.number("reminder_id must be a number").min(1, "reminder_id must be 1 or greater")
})