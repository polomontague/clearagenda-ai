export default function getIntervalLabel(frequency: string, interval: number) {
    const labelMap: Record<string, string> = {
        daily: "Day",
        weekly: "Week",
        monthly: "Month",
        yearly: "Year"
    }
    return `${interval > 1 ? `${interval} ` : ""}${labelMap[frequency]}${interval > 1 ? "s" : ""}`
}