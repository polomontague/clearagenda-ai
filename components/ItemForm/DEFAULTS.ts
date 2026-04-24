const roundMinutes = (date: Date) => {
    const milliseconds = 5 * 60 * 1000 // 5 minutes in milliseconds
    return new Date(Math.round(date.getTime() / milliseconds) * milliseconds)
}

const DEFAULTS = {
    type: "task" as const,
    description: "",
    has_deadline: false,
    deadline: new Date(),
    name: "",
    starts: roundMinutes(new Date()),
    duration: 15,
    occurs: "once" as const,
    frequency: "daily" as const,
    interval: 1,
    ordinal: 1 as const,
    weekday: new Date().getDay(),
    weekdays: [ new Date().getDay() ],
    monthly_type: "days" as const,
    days: [ new Date().getDate() ],
    yearly_type: "day" as const,
    months: [ new Date().getMonth() ],
    day: new Date().getDate(),
    repeat_start: new Date(),
    notes: ""
}

export default DEFAULTS