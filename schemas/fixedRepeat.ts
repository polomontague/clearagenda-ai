import z from "zod"
import Validation from "@/lib/Validation"

const interval = z.number("repeat.interval must be a number").min(1, "repeat.interval must be 1 or greater")
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
const starts = z.string("repeat.starts must be a string").trim().refine(value => Validation.isoDateTime(value), "repeat.starts must be a valid ISO 8601 datetime")
const ends = z.string("repeats.ends must be a string").trim().refine(value => Validation.isoDateTime(value), "repeats.ends must be a valid ISO 8601 datetime").optional()
const daily = z.object({
    frequency: z.literal("daily", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval,
    starts,
    ends
})
const weekly = z.object({
    frequency: z.literal("weekly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval,
    weekdays: z.array(z.number(), "repeat.weekdays must be an array of numbers").refine(value => value.every(value => [0, 1, 2, 3, 4, 5, 6].includes(value)), "elements of repeat.weekdays must be 0-6").min(1, "repeat.weekdays must have at least 1 element"),
    starts,
    ends
})
const daysMonthly = z.object({
    type: z.literal("days", 'repeat.type must be "days" or "weekday"'),
    frequency: z.literal("monthly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval,
    days: z.array(z.number(), "repeat.days must be an array of numbers").refine(value => value.every(value => value >= 1 && value <= 31), "elements of repeat.days must be 1-31"),
    starts,
    ends
})
const weekdayMonthly = z.object({
    type: z.literal("weekday", 'repeat.type must be "days" or "weekday"'),
    frequency: z.literal("monthly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval,
    ordinal,
    weekday,
    starts,
    ends
})
const monthly = z.discriminatedUnion("type", [daysMonthly, weekdayMonthly])
const dayYearly = z.object({
    type: z.literal("day", 'repeat.type must be "day" or "weekday"'),
    frequency: z.literal("yearly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval,
    months: z.array(z.number(), "repeat.months must be an array of numbers").refine(value => value.every(value => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(value)), "elements of repeat.months must be 0-11"),
    day: z.number("repeat.day must be a number").min(1, "repeat.day must be 1 or greater"),
    starts,
    ends
})
const weekdayYearly = z.object({
    type: z.literal("weekday", 'repeat.type must be "day" or "weekday"'),
    frequency: z.literal("yearly", 'frequency must be "daily", "weekly", "monthly", or "yearly"'),
    interval,
    months: z.array(z.number(), "repeat.months must be an array of numbers").refine(value => value.every(value => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].includes(value)), "elements of repeat.months must be 0-11"),
    ordinal,
    weekday,
    starts,
    ends
})
const yearly = z.discriminatedUnion("type", [ dayYearly, weekdayYearly ])
export const fixedRepeat = z.discriminatedUnion("frequency", [daily, weekly, monthly, yearly], 'repeat.frequency must be "daily", "weekly", "monthly", or "yearly"')