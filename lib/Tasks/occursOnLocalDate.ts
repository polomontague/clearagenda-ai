import Repeat from "@/types/Repeat"
import Utility from "@/lib/Utility"

export default function occursOnLocalDate(repeat: Repeat, date: Date): boolean {
    const { starts, ends } = repeat
    const dateKey = Utility.getDateKey(date)
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
            const day = getLocalNthWeekdayOfMonth(date.getFullYear(), date.getMonth(), repeat.weekday, repeat.ordinal)
            if (!day) return false
            return Utility.getDateKey(day) === Utility.getDateKey(date)
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
            const day = getLocalNthWeekdayOfMonth(date.getFullYear(), date.getMonth(), repeat.weekday, repeat.ordinal)
            if (!day) return false
            return Utility.getDateKey(day) === Utility.getDateKey(date)
        }
    }
    return false
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

const getLocalNthWeekdayOfMonth = (year: number, month: number, weekday: number, ordinal: number) => {
    const matches: Date[] = []
    for (let d = 1; d <= 31; d++) {
        const date = new Date(year, month, d)
        if (date.getMonth() !== month) break
        if (date.getDay() === weekday) {
            matches.push(new Date(date))
        }
    }
    if (matches.length === 0) return undefined
    if (ordinal > 0) return matches[ordinal - 1]
    const indexFromEnd = Math.abs(ordinal)
    return matches[matches.length - indexFromEnd]
}