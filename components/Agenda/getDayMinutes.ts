import { Day } from "./getDateItems"

export default function getDayMinutes(day: Day) {
    let minutes = 0
    Object.entries(day).forEach(([_, item]) => {
        if (item.type === "task") {
            for (const step of item.steps) {
                minutes += step.duration
            }
        } else if (item.type === "event") {
            minutes += ((new Date(item.ends).getTime() - new Date(item.starts).getTime()) / 1000) / 60
        }
    })
    return minutes
}