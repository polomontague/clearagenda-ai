export default function getWeekdaysLabel(weekdays: number[]) {
    const SHOW = 3
    const names = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
    if (weekdays.length === 7) return "Every Day"
    const remaining = weekdays.length - SHOW
    return `${weekdays.slice(0, SHOW).map(weekday => names[weekday]).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}`
}