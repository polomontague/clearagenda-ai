type Values = {
    type: "task" | "event",
    description: string,
    hasDeadline: boolean,
    deadline: Date,
    name: string,
    starts: Date,
    duration: number,
    occurs: "once" | "repeating",
    frequency: "daily" | "weekly" | "monthly" | "yearly",
    interval: number,
    ordinal: 1 | 2 | 3 | 4 | 5 | -2 | -1,
    weekday: number
    weekdays: number[],
    monthlyType: "days" | "weekday",
    days: number[],
    months: number[],
    yearlyType: "day" | "weekday",
    day: number,
    repeatStart: Date,
    notes: string
}

export default Values

export type RepeatValues = Pick<Values, "frequency" | "repeatStart" | "interval" | "weekdays" | "monthlyType" | "days" | "ordinal" | "weekday" | "yearlyType" | "months" | "day">