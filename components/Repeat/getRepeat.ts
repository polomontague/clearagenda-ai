import Repeat, { Ordinal } from "@/types/Repeat"
import Utility from "@/lib/Utility"

type Values = {
    frequency: "daily" | "weekly" | "monthly" | "yearly",
    interval: number,
    weekdays: number[],
    monthlyType: "days" | "weekday",
    days: number[],
    ordinal: Ordinal,
    weekday: number,
    months: number[],
    yearlyType: "day" | "weekday",
    day: number,
    starts: Date,
    hasEnds: boolean,
    ends: Date
}

export default function getRepeat({
    frequency,
    interval,
    weekdays,
    monthlyType,
    days,
    ordinal,
    weekday,
    months,
    yearlyType,
    day,
    starts,
    hasEnds,
    ends
}: Values) {
    const repeat: Repeat = (
        frequency === "daily" ? {
            frequency,
            interval,
            starts: Utility.getDateKey(starts),
            ends: hasEnds ? Utility.getDateKey(ends) : undefined
        } : frequency === "weekly" ? {
            frequency,
            interval,
            weekdays,
            starts: Utility.getDateKey(starts),
            ends: hasEnds ? Utility.getDateKey(ends) : undefined
        } : frequency === "monthly" ? (
            monthlyType === "days" ? {
                type: monthlyType,
                frequency,
                interval,
                days,
                starts: Utility.getDateKey(starts),
                ends: hasEnds ? Utility.getDateKey(ends) : undefined
            } : { // weekday
                type: monthlyType,
                frequency,
                interval,
                ordinal,
                weekday,
                starts: Utility.getDateKey(starts),
                ends: hasEnds ? Utility.getDateKey(ends) : undefined
            }
        ) : ( // yearly
            yearlyType === "day" ? {
                type: yearlyType,
                frequency,
                interval,
                months,
                day,
                starts: Utility.getDateKey(starts),
                ends: hasEnds ? Utility.getDateKey(ends) : undefined
            } : { // weekday
                type: yearlyType,
                frequency,
                interval,
                months,
                ordinal,
                weekday,
                starts: Utility.getDateKey(starts),
                ends: hasEnds ? Utility.getDateKey(ends) : undefined
            }
        )
    )
    return repeat
}