type Setters = {
    setType: (value: "task" | "event") => void,
    setDescription: (value: string) => void,
    setHasDeadline: (value: boolean) => void,
    setDeadline: (value: Date) => void,
    setName: (value: string) => void,
    setStarts: (value: Date) => void,
    setDuration: (value: number) => void,
    setOccurs: (value: "once" | "repeating") => void,
    setFrequency: (value: "daily" | "weekly" | "monthly" | "yearly") => void,
    setInterval: (value: number) => void,
    setOrdinal: (value: 1 | 2 | 3 | 4 | 5 | -2 | -1) => void,
    setWeekday: (value: number) => void,
    setWeekdays: (value: number[]) => void,
    setMonthlyType: (value: "days" | "weekday") => void,
    setDays: (value: number[]) => void,
    setMonths: (value: number[]) => void,
    setYearlyType: (value: "day" | "weekday") => void,
    setDay: (value: number) => void,
    setRepeatStart: (value: Date) => void,
    setNotes: (value: string) => void
}

export default Setters

export type RepeatSetters = Pick<Setters, "setFrequency" | "setRepeatStart" | "setInterval" | "setWeekdays" | "setMonthlyType" | "setDays" | "setOrdinal" | "setWeekday" | "setYearlyType" | "setMonths" | "setDay">