type BaseRepeat = {
    interval: number,
    starts: string
    ends?: string
}

export type Ordinal = 1 | 2 | 3 | 4 | 5 | -1 | -2

type DailyRepeat = BaseRepeat & {
    frequency: "daily",
}

type WeeklyRepeat = BaseRepeat & {
    frequency: "weekly",
    weekdays: number[] // 0-6
}

type DaysMonthlyRepeat = BaseRepeat & {
    type: "days",
    frequency: "monthly",
    days: number[] // 1-31
}

type WeekdayMonthlyRepeat = BaseRepeat & {
    type: "weekday",
    frequency: "monthly",
    ordinal: Ordinal,
    weekday: number, // 0-6
}

type MonthlyRepeat = DaysMonthlyRepeat | WeekdayMonthlyRepeat

type DayYearlyRepeat = BaseRepeat & {
    type: "day",
    frequency: "yearly",
    months: number[], // 0-11
    day: number // 1-31
}

type WeekdayYearlyRepeat = BaseRepeat & {
    type: "weekday",
    frequency: "yearly",
    months: number[], // 0-11
    ordinal: Ordinal,
    weekday: number
}

type YearlyRepeat = DayYearlyRepeat | WeekdayYearlyRepeat


type Repeat = DailyRepeat | WeeklyRepeat | MonthlyRepeat | YearlyRepeat

export default Repeat