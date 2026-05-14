import Item, { Task, Event, Repeat } from "@/types/Item"
import User from "@/types/User"
import { timeStamp } from "console"
import { DateTime } from "luxon"

const Utility = {
    formatDate: (date: Date, noToday?: boolean) => {
        const today = new Date()
        if (!noToday && date.toLocaleDateString("en-CA") === today.toLocaleDateString("en-CA")) return "Today"
        const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    },
    formatDuration: (minutes: number, hoursInDay: number = 24) => {
        const MINUTES_IN_HOUR = 60
        const MINUTES_IN_DAY = 60 * hoursInDay
        const MINUTES_IN_MONTH = MINUTES_IN_DAY * 30
        const MINUTES_IN_YEAR = MINUTES_IN_DAY * 365

        let remaining = minutes
        const years = Math.floor(remaining / MINUTES_IN_YEAR)
        remaining %= MINUTES_IN_YEAR
        const months = Math.floor(remaining / MINUTES_IN_MONTH)
        remaining %= MINUTES_IN_MONTH
        const days = Math.floor(remaining / MINUTES_IN_DAY)
        remaining %= MINUTES_IN_DAY
        const hours = Math.floor(remaining / MINUTES_IN_HOUR)
        remaining %= MINUTES_IN_HOUR
        const minutes2 = remaining

        let time = ""
        if (years) {
            time = `${years} ${years === 1 ? "Yr" : "Yrs"}`
            if (months) time += `, ${months} ${months === 1 ? "Mo" : "Mos"}`
        } else if (months) {
            time = `${months} ${months === 1 ? "Mo" : "Mos"}`
            if (days) time += `, ${days} ${days === 1 ? "Day" : "Days"}`
        } else if (days) {
            time = `${days} ${days === 1 ? "Day" : "Days"}`
            if (hours) time += `, ${hours} ${hours === 1 ? "Hr" : "Hrs"}`
        } else if (hours) {
            time += `${hours} ${hours === 1 ? "Hr" : "Hrs"}`
            if (minutes2) time += `, ${minutes2} ${minutes2 === 1 ? "Min" : "Mins"}`
        } else {
            time = `${minutes2} ${minutes2 === 1 ? "Min" : "Mins"}`
        }
        return time
    },
    formatTime: (date: Date) => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const amOrPm = hours < 12 ? "AM" : "PM"
        return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${amOrPm}`
    },
    formatOrdinal: (n: number) => {
        if (n === -1) return "last"
        if (n === -2) return "second last"
        const suffix =
            n % 10 === 1 && n % 100 !== 11 ? "st" :
            n % 10 === 2 && n % 100 !== 12 ? "nd" :
            n % 10 === 3 && n % 100 !== 13 ? "rd" :
            "th"
        return `${n}${suffix}`
    },
    getShortRepeatLabel: (repeat: Repeat): string => {
        const WEEKDAYS = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
        const MONTHS = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        let message = ""
        if (repeat.frequency === "daily") {
            if (repeat.interval === 1) return "Every day"
            return `Every ${repeat.interval} days`
        }
        if (repeat.frequency === "weekly") {
            const weeks = repeat.interval === 1 ? "wk"
                : `${repeat.interval} wks`
            const weekdays = `${WEEKDAYS[repeat.weekdays[0]]}${repeat.weekdays.length > 1 ? ` +${repeat.weekdays.length - 1}` : ""}`
            return `Every ${weeks} on ${weekdays}`
        }
        if (repeat.frequency === "monthly") {
            const months = repeat.interval === 1 ? "mo"
                : `${repeat.interval} mos`
            if (repeat.type === "days") {
                const days = `${Utility.formatOrdinal(repeat.days[0])}${repeat.days.length > 1 ? ` +${repeat.days.length - 1}` : ""}`
                return `Every ${months} on the ${days}`
            }
            if (repeat.type === "weekday") {
                const weekday = `${Utility.formatOrdinal(repeat.ordinal)} ${WEEKDAYS[repeat.weekday]}`
                return `Every ${months}, ${weekday}`
            }
            return message
        }
        if (repeat.frequency === "yearly") {
            const years = repeat.interval === 1 ? "yr"
                : `${repeat.interval} yrs`
            const months = `${MONTHS[repeat.months[0]]}${repeat.months.length > 1 ? ` +${repeat.months.length - 1}` : ""}`
            if (repeat.type === "day") {
                const day = Utility.formatOrdinal(repeat.day)
                return `Every ${years} on the ${day} of ${months}`
            }
            if (repeat.type === "weekday") {
                const weekday = `${Utility.formatOrdinal(repeat.ordinal)} ${WEEKDAYS[repeat.weekday]}`
                return `Every ${years} on the ${weekday} of ${months}`
            }
        }
        return "Repeats"
    },
    getRepeatLabel: (repeat: Repeat, timezone?: string): string => {
        const WEEKDAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const MONTHS = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
        const formatWeekdaysShort = (days: number[]) => days.map(d => WEEKDAYS_SHORT[d])
        const formatWeekday = (day: number) => WEEKDAYS[day]
        const joinList = (items: string[]) => {
            if (items.length === 1) return items[0]
            if (items.length === 2) return `${items[0]} and ${items[1]}`
            return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
        }
        const formatMonths = (months: number[]) => joinList(months.map(m => MONTHS[m]))
        const formatOrdinals = (nums: number[]) => joinList(nums.map(Utility.formatOrdinal))
        const interval = repeat.interval
        const every = interval === 1 ? "every" : `every ${interval}`
        let message = ""
        if (repeat.frequency === "daily") {
            message = interval === 1 ? "Occurs every day" : `Occurs ${every} days`
        }
        if (repeat.frequency === "weekly") {
            const days = formatWeekdaysShort(repeat.weekdays)
            if (interval === 1 && days.length === 1) {
                message = `Occurs every ${days[0]}`
            }
            message = `Occurs ${every} week${interval > 1 ? "s" : ""}${days.length ? ` on ${joinList(days)}` : ""}`
        }
        if (repeat.frequency === "monthly") {
            if (repeat.type === "days") {
                if (!repeat.days.length) message = "Occurs every month"
                const days = formatOrdinals(repeat.days)
                message = interval === 1
                    ? `Occurs every month on the ${days}`
                    : `Occurs every ${interval} months on the ${days}`
            }
            if (repeat.type === "weekday") {
                const ord = Utility.formatOrdinal(repeat.ordinal)
                const weekday = formatWeekday(repeat.weekday)
                message = interval === 1
                    ? `Occurs on the ${ord} ${weekday} of every month`
                    : `Occurs on the ${ord} ${weekday} of every ${interval} months`
            }
        }
        if (repeat.frequency === "yearly") {
            const months = formatMonths(repeat.months)
            const base = interval === 1
                ? "Occurs every year"
                : `Occurs every ${interval} years`
            if (repeat.type === "day") {
                const day = Utility.formatOrdinal(repeat.day)
                const monthPart = months ? ` of ${months}` : ""
                message = `${base} on the ${day}${monthPart}`
            }
            if (repeat.type === "weekday") {
                const ord = Utility.formatOrdinal(repeat.ordinal)
                const weekday = formatWeekday(repeat.weekday)
                const monthPart = months ? ` of ${months}` : ""
                message = `${base} on the ${ord} ${weekday}${monthPart}`
            }
        }
        const [ startsYear, startsMonth, startsDay ] = repeat.starts.split("-").map(Number)
        let startsDate = new Date(startsYear, startsMonth, startsDay)
        if (timezone) {
            startsDate = DateTime.fromObject({ year: startsYear, month: startsMonth, day: startsDay }, { zone: timezone }).toJSDate()
        }
        let endsDate
        if (repeat.ends) {
            const [endsYear, endsMonth, endsDay] = repeat.ends.split("-").map(Number)
            if (timezone) {
                endsDate = DateTime.fromObject({ year: endsYear, month: endsMonth, day: endsDay }, { zone: timezone }).toJSDate()
            } else {
                endsDate = new Date(endsYear, endsMonth, endsDay)
            }
        }
        const starts = `${MONTHS[startsDate.getMonth()]} ${Utility.formatOrdinal(startsDate.getDate())}, ${startsDate.getFullYear()}`
        const ends = endsDate ? `${MONTHS[endsDate.getMonth()]} ${Utility.formatOrdinal(endsDate.getDate())}, ${endsDate.getFullYear()}` : ""
        if (ends) {
            message += ` from ${starts} to ${ends}`
        } else {
            message += ` starting on ${starts}`
        }
        return message
    },
    formatEventFrom: (item: Event) => {
        const starts = new Date(item.starts)
        const ends = new Date(starts)
        ends.setMinutes(ends.getMinutes() + item.duration)
        return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
    },
    getItemStatus: (item: Item, accent: User["preferences"]["accent"]): {
        code: "completed" | "overdue" | "upcoming" | "in_progress" | "repeating" | "ended",
        color: string,
        label: string
    } => {
        const COLORS = {
            sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
            red: accent === "red" ? "var(--coral)" : "var(--red)",
            yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
            lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
            gray: "var(--layer-4-light)"
        }
        if (item.type === "task") {
            if (item.occurs === "once") {
                const completion = Utility.getTaskCompletion(item)
                if (completion === 1) return { code: "completed", color: COLORS.gray, label: "Completed" }
                const overdue = item.deadline ? new Date(item.deadline) < new Date() : false
                if (overdue) return { code: "overdue", color: COLORS.red, label: "Overdue" }
                if (completion === 0) return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
                return { code: "in_progress", color: COLORS.yellow, label: "In Progress" }
            } else { // repeating
                return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
            }
        } else { // event
            if (item.occurs === "once") {
                const completed = Utility.getItemCompleted(item)
                if (completed) return { code: "ended", color: COLORS.gray, label: "Ended" }
                return { code: "upcoming", color: COLORS.sky, label: "Upcoming" }
            } else { // repeating
                return { code: "repeating", color: COLORS.lavender, label: "Repeating" }
            }
        }
    },
    getTaskCompletion: (item: Task) => {
        let totalMinutes = 0
        let completedMinutes = 0
        for (const step of item.steps) {
            totalMinutes += step.duration
            if (step.completed) completedMinutes += step.duration
        }
        return Math.round((completedMinutes / totalMinutes) * 100) / 100
    },
    getItemCompleted: (item: Item) => {
        if (item.type === "task") {
            for (let i = 0; i < item.steps.length; i++) {
                if (!item.steps[i].completed) return false
            }
        } else if (item.type === "event") {
            if (item.occurs === "once") {
                const ends = new Date(item.starts)
                ends.setMinutes(ends.getMinutes() + item.duration)
                if (new Date(ends).getTime() > new Date().getTime()) return false
            }
            if (item.occurs === "repeating") return false // Ongoing repeat ing events are not completed
        }
        return true
    },
    roundTime: (date: Date) => {
        const result = new Date(date)
        const minutes = result.getMinutes()
        const roundedMinutes = Math.ceil(minutes / 5) * 5
        result.setMinutes(roundedMinutes, 0, 0)
        return result
    },
    getDateKey: (date: Date) => {
        const year = date.getFullYear()
        const months = date.getMonth()
        const day = date.getDate()
        return `${year}-${(months + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
    }
}

export default Utility