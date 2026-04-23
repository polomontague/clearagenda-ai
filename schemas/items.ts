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

const ordinal = z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(-1),
    z.literal(-2)
], "repeat.ordinal must be 1, 2, 3, 4, 5, -1, or -2")
const weekday = z.number("repeat.weekday must be a number").refine(value => [0, 1, 2, 3, 4, 5, 6].includes(value), "repeat.weekday must be 0-6")
const daily = z.object({
    frequency: z.literal("daily", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval: z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater")
})
const weekly = z.object({
    frequency: z.literal("weekly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval: z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater"),
    weekdays: z.array(z.number(), "repeat.weekdays must be an array of numbers").refine(value => value.every(value => [0, 1, 2, 3, 4, 5, 6].includes(value)), "elements of repeat.weekdays must be 0-6").min(1, "repeat.weekdays must have at least 1 element")
})
const daysMonthly = z.object({
    type: z.literal("days", 'repeat.type must be "days" or "weekday"'),
    frequency: z.literal("monthly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval: z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater"),
    days: z.array(z.number(), "repeat.days must be an array of numbers").refine(value => value.every(value => value >= 1 && value <= 31), "elements of repeat.days must be 1-31")
})
const weekdayMonthly = z.object({
    type: z.literal("weekday", 'repeat.type must be "days" or "weekday"'),
    frequency: z.literal("monthly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval: z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater"),
    ordinal,
    weekday
})
const monthly = z.discriminatedUnion("type", [daysMonthly, weekdayMonthly])
const dayYearly = z.object({
    type: z.literal("day", 'repeat.type must be "day" or "weekday"'),
    frequency: z.literal("yearly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval: z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater"),
    months: z.array(z.number(), "repeat.months must be an array of numbers").refine(value => value.every(value => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(value)), "elements of repeat.months must be 0-11"),
    day: z.number("repeat.day must be a number").min(1, "repeat.day must be 1 or greater")
})
const weekdayYearly = z.object({
    type: z.literal("weekday", 'repeat.type must be "day" or "weekday"'),
    frequency: z.literal("yearly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval: z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater"),
    months: z.array(z.number(), "repeat.months must be an array of numbers").refine(value => value.every(value => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(value)), "elements of repeat.months must be 0-11"),
    ordinal,
    weekday
})
const yearly = z.discriminatedUnion("type", [ dayYearly, weekdayYearly ])
const repeat = z.discriminatedUnion("frequency", [daily, weekly, monthly, yearly], 'repeat.type must be "daily", "weekly", "monthly", or "yearly"')
const eventBodySchema = z.object({
    type: z.literal("event", 'type must be "task" or "event"'),
    name: z.string("name must be a string").trim().min(1, "name must be 1 or more characters"),
    notes: z.string("notes must be a string").trim().min(1, "notes must be 1 or more characters").optional(),
    starts: z.string("starts must be a string").trim().refine(value => Validation.dateTime(value), "starts must be a valid ISO 8601 datetime"),
    duration: z.number("duration must be a number").min(1, "duration must be 1 or greater"),
    repeat: repeat.optional()
})
export const itemBodySchema = z.discriminatedUnion("type", [ taskBodySchema, eventBodySchema ], 'type must be "task" or "event"')

export const itemStepParamsSchema = z.object({
    item_id: z.coerce.number("item_id must be a number").min(1, "item_id must be 1 or greater"),
    step_id: z.coerce.number("step_id must be a number").min(1, "step_id must be 1 or greater")
})