const Utility = {
    formatDate: (date: Date) => {
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
        return `${hours.toString().padEnd(2, "0")}:${minutes.toString().padEnd(2, "0")} ${amOrPm}`
    }
}

export default Utility