export default function getNthWeekdayOfMonth(year: number, month: number, weekday: number, ordinal: number) {
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