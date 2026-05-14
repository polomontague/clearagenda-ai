export default function getMonthsLabel(months: number[]) {
    const SHOW = 3
    const names = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
    if (months.length === 12) return "Every Month"
    const remaining = months.length - SHOW
    return `${months.slice(0, SHOW).map(month => names[month]).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}`
}