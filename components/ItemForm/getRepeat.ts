import { Repeat } from "@/types/Item"
import Values, { RepeatValues } from "./Values"

export default function getRepeat({ frequency, repeatStart, hasRepeatEnd, repeatEnd, interval, weekdays, monthlyType, days, ordinal, weekday, yearlyType, months, day }: RepeatValues) {
    const repeat: Repeat = (
        frequency === "daily" ? {
            frequency,
            interval,
            starts: repeatStart.toISOString(),
            ends: hasRepeatEnd ? repeatEnd.toISOString() : undefined
        } : frequency === "weekly" ? {
            frequency,
            interval,
            weekdays,
            starts: repeatStart.toISOString(),
            ends: hasRepeatEnd ? repeatEnd.toISOString() : undefined
        } : frequency === "monthly" ? (
            monthlyType === "days" ? {
                type: monthlyType,
                frequency,
                interval,
                days,
                starts: repeatStart.toISOString(),
                ends: hasRepeatEnd ? repeatEnd.toISOString() : undefined
            } : { // weekday
                type: monthlyType,
                frequency,
                interval,
                ordinal,
                weekday,
                starts: repeatStart.toISOString(),
                ends: hasRepeatEnd ? repeatEnd.toISOString() : undefined
            }
        ) : ( // yearly
            yearlyType === "day" ? {
                type: yearlyType,
                frequency,
                interval,
                months,
                day,
                starts: repeatStart.toISOString(),
                ends: hasRepeatEnd ? repeatEnd.toISOString() : undefined
            } : { // weekday
                type: yearlyType,
                frequency,
                interval,
                months,
                ordinal,
                weekday,
                starts: repeatStart.toISOString(),
                ends: hasRepeatEnd ? repeatEnd.toISOString() : undefined
            }
        )
    )
    return repeat
}