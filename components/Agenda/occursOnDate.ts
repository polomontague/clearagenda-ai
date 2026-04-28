import { RepeatingItem } from "@/types/Item"
import getNthWeekdayOfMonth from "./getNthWeekdayOfMonth"

export default function occursOnDate(item: RepeatingItem, date: Date): boolean {
    const starts = new Date(item.repeat.starts)
    const ends = item.repeat.ends ? new Date(item.repeat.ends) : undefined
    const target = new Date(date)
    // Normalize times (compare dates only)
    starts.setHours(0, 0, 0, 0)
    if (ends) ends.setHours(23, 59, 59, 999) // final milisecond of the day
    target.setHours(0, 0, 0, 0)
    if (target < starts) return false
    if (ends && target > ends) return false
    const diffDays = Math.floor((target.getTime() - starts.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return false // ??? if its in the future, return false ???
    const repeat = item.repeat
    if (repeat.frequency === "daily") {
        return diffDays % repeat.interval === 0
    }
    if (repeat.frequency === "weekly") {
        const diffWeeks = Math.floor(diffDays / 7)
        return diffWeeks % repeat.interval === 0 && repeat.weekdays.includes(target.getDay())
    }
    if (repeat.frequency === "monthly") {
        const diffMonths = (target.getFullYear() - starts.getFullYear()) * 12 + (target.getMonth() - starts.getMonth())
        if (diffMonths < 0 || diffMonths % repeat.interval !== 0) return false
        if (repeat.type === "days") {
            return repeat.days.includes(target.getDate())
        }
        if (repeat.type === "weekday") {
            const weekday = getNthWeekdayOfMonth(target.getFullYear(), target.getMonth(), repeat.weekday, repeat.ordinal)
            return weekday?.getTime() === target.getTime()
        }
    }
    if (repeat.frequency === "yearly") {
        const diffYears = target.getFullYear() - starts.getFullYear()
        if (diffYears < 0 || diffYears % repeat.interval !== 0) return false
        if (!repeat.months.includes(target.getMonth())) return false
        if (repeat.type === "day") {
            return repeat.day === target.getDate()
        }
        if (repeat.type === "weekday") {
            const weekday = getNthWeekdayOfMonth(target.getFullYear(), target.getMonth(), repeat.weekday, repeat.ordinal)
            return weekday?.getTime() === target.getTime()
        }
    }
    return false
}