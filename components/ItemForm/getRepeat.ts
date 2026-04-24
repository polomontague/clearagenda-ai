import { Repeat } from "@/types/Item"
import Values, { RepeatValues } from "./Values"

export default function getRepeat({ frequency, repeatStart, interval, weekdays, monthlyType, days, ordinal, weekday, yearlyType, months, day }: RepeatValues) {
    const repeat: Repeat = (
        frequency === "daily" ? {
            starts: repeatStart.toISOString(),
            frequency,
            interval
        } : frequency === "weekly" ? {
            starts: repeatStart.toISOString(),
            frequency,
            interval,
            weekdays
        } : frequency === "monthly" ? (
            monthlyType === "days" ? {
                type: monthlyType,
                starts: repeatStart.toISOString(),
                frequency,
                interval,
                days
            } : { // weekday
                type: monthlyType,
                starts: repeatStart.toISOString(),
                frequency,
                interval,
                ordinal,
                weekday
            }
        ) : ( // yearly
            yearlyType === "day" ? {
                type: yearlyType,
                starts: repeatStart.toISOString(),
                frequency,
                interval,
                months,
                day
            } : { // weekday
                type: yearlyType,
                starts: repeatStart.toISOString(),
                frequency,
                interval,
                months,
                ordinal,
                weekday
            }
        )
    )
    return repeat
}