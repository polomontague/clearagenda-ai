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
    weekdays: number[]
}

type DaysMonthlyRepeat = BaseRepeat & {
    type: "days",
    frequency: "monthly",
    days: number[]
}

type WeekdayMonthlyRepeat = BaseRepeat & {
    type: "weekday",
    frequency: "monthly",
    ordinal: Ordinal,
    weekday: number,
}

type MonthlyRepeat = DaysMonthlyRepeat | WeekdayMonthlyRepeat

type DayYearlyRepeat = BaseRepeat & {
    type: "day",
    frequency: "yearly",
    months: number[],
    day: number
}

type WeekdayYearlyRepeat = BaseRepeat & {
    type: "weekday",
    frequency: "yearly",
    months: number[],
    ordinal: Ordinal,
    weekday: number
}

type YearlyRepeat = DayYearlyRepeat | WeekdayYearlyRepeat


type Repeat = DailyRepeat | WeeklyRepeat | MonthlyRepeat | YearlyRepeat

export default Repeat