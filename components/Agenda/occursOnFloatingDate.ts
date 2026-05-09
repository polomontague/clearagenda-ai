import { RepeatingReminder } from "@/types/Reminder"
import getDateKey from "./getDateKey"
import getNthWeekdayOfMonth from "./getNthWeekdayOfMonth"

export default function reminderOccursOnDate(reminder: RepeatingReminder, date: Date) {
    const { repeat } = reminder
    const { starts, ends } = repeat
    const dateKey = getDateKey(date)
    if (dateKey < starts) return false
    if (ends && dateKey > ends) return false
    if (repeat.frequency === "daily") {
        const diffDays = getDiffDays(starts, date)
        return diffDays % repeat.interval === 0
    }
    if (repeat.frequency === "weekly") {
        const diffWeeks = Math.floor(getDiffDays(starts, date) / 7)
        return diffWeeks % repeat.interval === 0 && repeat.weekdays.includes(date.getDay())
    }
    if (repeat.frequency === "monthly") {
        const diffMonths = getDiffMonths(starts, date)
        if (diffMonths < 0 || diffMonths % repeat.interval !== 0) return false
        if (repeat.type === "days") {
            return repeat.days.includes(date.getDate())
        }
        if (repeat.type === "weekday") {
            const day = getNthWeekdayOfMonth(date.getFullYear(), date.getMonth(), repeat.weekday, repeat.ordinal)
            if (!day) return false
            return getDateKey(day) === getDateKey(date)
        }
    }
    if (repeat.frequency === "yearly") {
        const year = Number(starts.split("-")[0])
        const diffYears = date.getFullYear() - year
        if (diffYears < 0 || diffYears % repeat.interval !== 0) return false
        if (!repeat.months.includes(date.getMonth())) return false
        if (repeat.type === "day") {
            return repeat.day === date.getDay()
        }
        if (repeat.type === "weekday") {
            const day = getNthWeekdayOfMonth(date.getFullYear(), date.getMonth(), repeat.weekday, repeat.ordinal)
            if (!day) return false
            return getDateKey(day) === getDateKey(date)
        }
    }
}

const getDiffDays = (starts: string, date: Date) => {
    const [year, month, day] = starts.split("-").map(Number)
    const startsUTC = Date.UTC(year, month - 1, day)
    const dateUTC = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    return Math.floor((dateUTC - startsUTC) / (1000 * 60 * 60 * 24)) // 1 day in milliseconds
}

const getDiffMonths = (starts: string, date: Date) => {
    const [startsYear, startsMonth] = starts.split("-").map(Number)
    const targetYear = date.getFullYear()
    const targetMonth = date.getMonth() + 1
    return (
        (targetYear - startsYear) * 12
        + (targetMonth - startsMonth)
    )
}