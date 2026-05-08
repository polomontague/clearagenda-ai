import { RepeatingItem } from "@/types/Item"
import getNthWeekdayOfMonth from "./getNthWeekdayOfMonth"

const getZonedParts = (date: Date, timezone: string) => {
    const dtf = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short"
    })
    const parts = dtf.formatToParts(date)
    const partMap: Record<string, string> = {}
    for (const part of parts) {
        if (part.type !== "literal") partMap[part.type] = part.value
    }
    return {
        year: parseInt(partMap.year),
        month: parseInt(partMap.month),
        day: parseInt(partMap.day)
    }
}

const getWeekday = (date: Date, timezone: string) => {
    return new Date(date.toLocaleString("en-US", { timeZone: timezone })).getDay()
}

export default function occursOnDate(item: RepeatingItem, date: Date): boolean {
    // expand repeat rules in event timezone, not local time!!!
    const timezone = "timezone" in item ? item.timezone : "UTC"
    const starts = new Date(item.repeat.starts)
    const ends = item.repeat.ends ? new Date(item.repeat.ends) : undefined
    const targetZoned = getZonedParts(date, timezone)
    const startZoned = getZonedParts(starts, timezone)
    const target = new Date(date)
    const start = new Date(starts)
    target.setHours(0, 0, 0, 0) // Normalize times
    start.setHours(0, 0, 0, 0) //  (compare dates only)
    if (target < start) return false
    if (ends && date > ends) return false
    const repeat = item.repeat
    if (repeat.frequency === "daily") {
        const diffDays = Math.floor((target.getTime() - starts.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays % repeat.interval === 0
    }
    if (repeat.frequency === "weekly") {
        const diffDays = Math.floor((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
        const diffWeeks = Math.floor(diffDays / 7)
        const weekday = getWeekday(date, timezone)
        return (
            diffWeeks >= 0 &&
            diffWeeks % repeat.interval === 0 &&
            repeat.weekdays.includes(weekday)
        )
    }
    if (repeat.frequency === "monthly") {
        const diffMonths = (targetZoned.year - startZoned.year) * 12 + (targetZoned.month - startZoned.month)
        if (diffMonths < 0 || diffMonths % repeat.interval !== 0) return false
        if (repeat.type === "days") {
            return repeat.days.includes(targetZoned.day)
        }
        if (repeat.type === "weekday") {
            const weekdayDate = getNthWeekdayOfMonth(targetZoned.year, targetZoned.month, repeat.weekday, repeat.ordinal)
            return weekdayDate?.getDate() === targetZoned.day
        }
    }
    if (repeat.frequency === "yearly") {
        const diffYears = targetZoned.year - startZoned.year
        if (diffYears < 0 || diffYears % repeat.interval !== 0) return false
        if (!repeat.months.includes(targetZoned.month)) return false
        if (repeat.type === "day") {
            return repeat.day === targetZoned.day
        }
        if (repeat.type === "weekday") {
            const weekdayDate = getNthWeekdayOfMonth(targetZoned.year, targetZoned.month, repeat.weekday, repeat.ordinal)
            return weekdayDate?.getDate() === targetZoned.day
        }
    }
    return false
}