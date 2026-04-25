import Item, { Task, Event, Repeat } from "@/types/Item"
import User from "@/types/User"

const Utility = {
    formatDate: (date: Date) => {
        const today = new Date()
        if (date.toLocaleDateString("en-CA") === today.toLocaleDateString("en-CA")) return "Today"
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
    getRepeatLabel: (repeat: Repeat) => {
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
        const formatSingleOrdinal = (n: number) => {
            if (n === -1) return "last"
            if (n === -2) return "second last"
            const suffix =
                n % 10 === 1 && n % 100 !== 11 ? "st" :
                n % 10 === 2 && n % 100 !== 12 ? "nd" :
                n % 10 === 3 && n % 100 !== 13 ? "rd" :
                "th"
            return `${n}${suffix}`
        }
        const formatOrdinals = (nums: number[]) => joinList(nums.map(formatSingleOrdinal))
        const interval = repeat.interval
        const every = interval === 1 ? "every" : `every ${interval}`
        if (repeat.frequency === "daily") {
            return interval === 1 ? "Occurs every day" : `Occurs ${every} days`
        }
        if (repeat.frequency === "weekly") {
            const days = formatWeekdaysShort(repeat.weekdays)
            if (interval === 1 && days.length === 1) {
                return `Occurs every ${days[0]}`
            }
            return `Occurs ${every} week${interval > 1 ? "s" : ""}${days.length ? ` on ${joinList(days)}` : ""}`
        }
        if (repeat.frequency === "monthly") {
        if (repeat.type === "days") {
            if (!repeat.days.length) return "Occurs every month"
            const days = formatOrdinals(repeat.days)
            return interval === 1
                ? `Occurs every month on the ${days}`
                : `Occurs every ${interval} months on the ${days}`
        }
        if (repeat.type === "weekday") {
            const ord = formatSingleOrdinal(repeat.ordinal)
            const weekday = formatWeekday(repeat.weekday)
            return interval === 1
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
                const day = formatSingleOrdinal(repeat.day)
                const monthPart = months ? ` of ${months}` : ""
                return `${base} on the ${day}${monthPart}`
            }
            if (repeat.type === "weekday") {
                const ord = formatSingleOrdinal(repeat.ordinal)
                const weekday = formatWeekday(repeat.weekday)
                const monthPart = months ? ` of ${months}` : ""
                return `${base} on the ${ord} ${weekday}${monthPart}`
            }
        }
        return "Repeats"
    },
    formatEventFrom: (item: Event) => {
        const starts = new Date(item.starts)
        const ends = new Date(starts)
        ends.setMinutes(ends.getMinutes() + item.duration)
        return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
    },
    formatTaskLength: (item: Task) => {
        let minutes = 0
        item.steps.forEach(step => minutes += step.duration)
        return Utility.formatDuration(minutes)
    },
    getItemStatus(item: Item, accent: User["preferences"]["accent"]): {
        color: string,
        label: string
    } {
        const colors = {
            sky: accent === "sky" ? "var(--turquoise)" : "var(--sky)",
            red: accent === "red" ? "var(--coral)" : "var(--red)",
            yellow: accent === "yellow" ? "var(--orange)" : "var(--yellow)",
            lavender: accent === "lavender" ? "var(--pink)" : "var(--lavender)",
            gray: "var(--layer-4-light)"
        }
        if (item.type === "task") {
            if (item.occurs === "once") {
                const completion = Utility.getTaskCompletion(item)
                if (completion === 1) return { color: colors.gray, label: "Completed" }
                const overdue = item.deadline ? new Date(item.deadline) < new Date() : false
                if (overdue) return { color: colors.red, label: "Overdue" }
                if (completion === 0) return { color: colors.sky, label: "Upcoming" }
                return { color: colors.yellow, label: "In Progress" }
            }
            if (item.occurs === "repeating") {
                return { color: colors.lavender, label: "Repeating" }
            }
        }
        if (item.type === "event") {
            if (item.occurs === "once") {
                const completed = Utility.getItemCompleted(item)
                if (completed) return { color: colors.gray, label: "Ended" }
                return { color: colors.sky, label: "Upcoming" }
            }
            if (item.occurs === "repeating") {
                return { color: colors.lavender, label: "Repeating" }
            }
        }
        return { color: "", label: "" }
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
    }
}

export default Utility