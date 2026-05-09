export default function getDateKey(date: Date) {
    const year = date.getFullYear()
    const months = date.getMonth()
    const day = date.getDate()
    return `${year}-${(months + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
}