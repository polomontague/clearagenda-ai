import Event, { RepeatingEvent } from "@/types/Event"
import { DateTime, Duration } from "luxon"

export default function getDateEvents(events: Event[], date: Date): Event[] {
    const result: Event[] = []
    const localDayStart = new Date(date)
    localDayStart.setHours(0, 0, 0, 0)
    const localDayEnd = new Date(localDayStart)
    localDayEnd.setDate(localDayEnd.getDate() + 1)
    for (const event of events) {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts.getTime() + (event.duration * 60 * 1000)) // convert seconds to milliseconds
            if (starts < localDayEnd && ends > localDayStart) {
                result.push(event)
            }
            continue
        }
        if (event.occurs === "repeating") {
            if (eventOccursOnDate(event, date)) {
                result.push(event)
            }
        }
    }
    return result
}

const eventOccursOnDate = (event: RepeatingEvent, date: Date): boolean => {
    const { repeat } = event
    const localDayStart = DateTime.fromJSDate(date).startOf("day")
    const localDayEnd = localDayStart.plus({ days: 1 })
    const zonedDayStart = localDayStart.setZone(event.timezone)
    const zonedDayEnd = localDayEnd.setZone(event.timezone)
    const days = [
        zonedDayStart.startOf("day"),
        zonedDayEnd.startOf("day")
    ]
    for (const day of days) {
        const dayKey = day.toFormat("yyyy-MM-dd")
        if (dayKey < event.repeat.starts) continue
        if (repeat.ends && dayKey > repeat.ends) continue
        if (repeat.frequency === "daily") {
            const [year, month, day2] = repeat.starts.split("-").map(Number)
            const repeatStarts = DateTime.fromObject({ year, month, day: day2 }, { zone: event.timezone }).startOf("day")
            const diffDays = Math.floor(
                day.startOf("day").diff(repeatStarts, "days").days
            )
            if (diffDays < 0 || diffDays % repeat.interval !== 0) continue
        }
        if (repeat.frequency === "weekly") {
            const [year, month, day2] = repeat.starts.split("-").map(Number)
            const repeatStarts = DateTime.fromObject({ year, month, day: day2 }, { zone: event.timezone }).startOf("day")
            const diffDays = Math.floor(
                day.startOf("day").diff(repeatStarts, "days").days
            )
            const diffWeeks = Math.floor(diffDays / 7)
            if (diffWeeks < 0 || diffWeeks % repeat.interval !== 0) continue
            if (!repeat.weekdays.includes(day.weekday % 7)) continue //??
        }
        if (repeat.frequency === "monthly") {
            const [startsYear, startsMonth] = repeat.starts.split("-").map(Number)
            const diffMonths = (day.year - startsYear) * 12 + ((day.month - 1) - (startsMonth - 1))
            if (diffMonths < 0 || diffMonths % repeat.interval !== 0) continue
            if (repeat.type === "days") {
                if (!repeat.days.includes(day.day)) continue
            }
            if (repeat.type === "weekday") {
                const matches: number[] = [] //??
                for (let d = 1; d <= 31; d++) {
                    const current = DateTime.fromObject({
                        year: day.year,
                        month: day.month,
                        day: d,
                    }, {
                        zone: event.timezone
                    })
                    if (current.month !== day.month) break
                    if (current.weekday % 7 === repeat.weekday) {
                        matches.push(current.day)
                    }
                }
                let occurrenceDay: number | undefined
                if (repeat.ordinal > 0) {
                    occurrenceDay = matches[repeat.ordinal - 1]
                } else {
                    occurrenceDay = matches[matches.length = Math.abs(repeat.ordinal)]
                }
                if (occurrenceDay !== day.day) continue
            }
        }
        if (repeat.frequency === "yearly") {
            const startYear = Number(repeat.starts.split("-")[0])
            const diffYears = day.year - startYear
            if (diffYears < 0 || diffYears % repeat.interval !== 0) continue
            if (!repeat.months.includes(day.month - 1)) continue
            if (repeat.type === "day") {
                if (repeat.day !== day.day) continue
            }
            if (repeat.type === "weekday") {
                const matches: number[] = [] //??
                for (let d = 1; d <= 31; d++) {
                    const current = DateTime.fromObject({
                        year: day.year,
                        month: day.month,
                        day: d
                    }, {
                        zone: event.timezone
                    })
                    if (current.month !== day.month) break
                    if (current.weekday % 7 === repeat.weekday) {
                        matches.push(current.day)
                    }
                    let occurrenceDay: number | undefined
                    if (repeat.ordinal > 0) {
                        occurrenceDay = matches[repeat.ordinal - 1]
                    } else {
                        occurrenceDay = matches[matches.length - Math.abs(repeat.ordinal)]
                    }
                    if (occurrenceDay !== day.day) continue
                }
            }
        }
        const [hours, minutes, secondsMs] = event.starts.split(":")
        const [seconds, milliseconds] = secondsMs.split(".")
        // Build occurrence in event timezone
        const occurrenceStarts = day.set({
            hour: Number(hours),
            minute: Number(minutes),
            second: Number(seconds),
            millisecond: Number(milliseconds)
        })
        const occurrenceEnds = occurrenceStarts.plus({ minutes: event.duration })
        // Overlap against user's local day
        const overlaps = occurrenceStarts.toUTC() < localDayEnd.toUTC() &&
            occurrenceEnds.toUTC() > localDayStart.toUTC()
        if (overlaps) return true
    }
    return false
}

const getDaySpan = (start: DateTime, end: DateTime, duration: number) => {
    const maxSpan = Duration.fromObject({
        minutes: duration
    })
    const days: DateTime[] = []
    let current = start.startOf("day")
}