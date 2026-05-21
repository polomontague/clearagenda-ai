const DEFAULTS = {
    frequency: "daily" as const,
    interval: 1,
    weekdays: [ new Date().getDay() ],
    monthlyType: "days" as const,
    days: [ new Date().getDate() ],
    ordinal: 1 as const,
    weekday: new Date().getDay(),
    months: [ new Date().getMonth() ],
    yearlyType: "day" as const,
    day: new Date().getDate(),
    starts: new Date(),
    hasEnds: false,
    ends: new Date()
}

export default DEFAULTS