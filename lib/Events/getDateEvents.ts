import Event, { EventOccurrence, RepeatingEvent } from "@/types/Event"
import { DateTime } from "luxon"

export default function getDateEvents(events: Event[], date: Date): EventOccurrence[] {
    const result: EventOccurrence[] = []
    const localDayStart = new Date(date)
    localDayStart.setHours(0, 0, 0, 0)
    const localDayEnd = new Date(localDayStart)
    localDayEnd.setDate(localDayEnd.getDate() + 1)
    for (const event of events) {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts.getTime() + (event.duration * 60 * 1000)) // convert seconds to milliseconds
            if (starts < localDayEnd && ends > localDayStart) {
                result.push({
                    event,
                    starts: new Date(event.starts)
                })
            }
            continue
        }
        if (event.occurs === "repeating") {
            result.push(...getOccurrencesForDate(event, date))
        }
    }
    return result
}

const getOccurrencesForDate = (event: RepeatingEvent, date: Date): EventOccurrence[] => {
    const occurrences: EventOccurrence[] = []
    const localDayStart = DateTime.fromJSDate(date).startOf("day")
    const localDayEnd = localDayStart.plus({ days: 1 })
    const zonedDayStart = localDayStart.setZone(event.timezone)
    const zonedDayEnd = localDayEnd.setZone(event.timezone)
    const days = [
        zonedDayStart.startOf("day"),
        zonedDayEnd.startOf("day")
    ] // Does this include events where neither the occurrence starts or ends match the requested date, but the event still spans over the requested date?
    for (const day of days) {
        if (!matchesRepeatRule(event, day)) continue
        const [hours, minutes, seconds, milliseconds] = event.starts.split(/[:.]/).map(Number)
        const occurrenceStarts = day.set({
            hour: hours,
            minute: minutes,
            second: seconds,
            millisecond: milliseconds
        }) // what date is this set to?
        const occurrenceEnds = occurrenceStarts.plus({ minutes: event.duration })
        const overlaps = occurrenceStarts.toUTC() < localDayEnd.toUTC() &&
            occurrenceEnds.toUTC() > localDayStart.toUTC()
        if (overlaps) {
            occurrences.push({ // doesn't this push multiple occurrences for the same calendar day?
                event,
                starts: occurrenceStarts.toJSDate()
            })
        }
    }
    return occurrences
}

const matchesRepeatRule = (event: RepeatingEvent, day: any): boolean => {
    const { repeat } = event
    const dayKey = day.toFormat("yyyy-MM-dd")
    if (dayKey < event.repeat.starts) return false
    if (repeat.ends && dayKey > repeat.ends) return false
    if (repeat.frequency === "daily") {
        const [year, month, day2] = repeat.starts.split("-").map(Number)
        const repeatStarts = DateTime.fromObject({ year, month, day: day2 }, { zone: event.timezone }).startOf("day")
        const diffDays = Math.floor(day.startOf("day").diff(repeatStarts, "days").days)
        if (diffDays < 0 || diffDays % repeat.interval !== 0) return false
        return true
    }
    if (repeat.frequency === "weekly") {
        const [year, month, day2] = repeat.starts.split("-").map(Number)
        const repeatStarts = DateTime.fromObject({ year, month, day: day2 }, { zone: event.timezone }).startOf("day")
        const diffDays = Math.floor(
            day.startOf("day").diff(repeatStarts, "days").days
        )
        const diffWeeks = Math.floor(diffDays / 7)
        if (diffWeeks < 0 || diffWeeks % repeat.interval !== 0) return false
        if (!repeat.weekdays.includes(day.weekday % 7)) return false
        return true
    }
    if (repeat.frequency === "monthly") {
        const [startsYear, startsMonth] = repeat.starts.split("-").map(Number)
        const diffMonths = (day.year - startsYear) * 12 + ((day.month - 1) - (startsMonth - 1))
        if (diffMonths < 0 || diffMonths % repeat.interval !== 0) return false
        if (repeat.type === "days") {
            return repeat.days.includes(day.day)
        }
        if (repeat.type === "weekday") {
            const matches: number[] = []
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
            return occurrenceDay === day.day
        }
        return false
    }
    if (repeat.frequency === "yearly") {
        const startYear = Number(repeat.starts.split("-")[0])
        const diffYears = day.year - startYear
        if (diffYears < 0 || diffYears % repeat.interval !== 0) return false
        if (!repeat.months.includes(day.month - 1)) return false
        if (repeat.type === "day") {
            return repeat.day === day.day
        }
        if (repeat.type === "weekday") {
            const matches: number[] = []
            for (let d = 1; d <= 31; d++) {
                const current = DateTime.fromObject({
                        year: day.year,
                        month: day.month,
                        day: d
                    }, { zone: event.timezone })
                if (current.month !== day.month) break
                const weekday = current.weekday % 7
                if (weekday === repeat.weekday) {
                    matches.push(current.day)
                }
            }
            let occurrenceDay: number | undefined
            if (repeat.ordinal > 0) {
                occurrenceDay = matches[repeat.ordinal - 1]
            } else {
                occurrenceDay = matches[matches.length - Math.abs(repeat.ordinal)]
            }
            return occurrenceDay === day.day
        }
        return false
    }
    return false
}