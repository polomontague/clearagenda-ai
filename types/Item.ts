import SimpleUser from "@/types/SimpleUser"

type Ordinal = 1 | 2 | 3 | 4 | 5 | -1 | -2

type Daily = {
    frequency: "daily",
    interval: number
}

type Weekly = {
    frequency: "weekly",
    interval: number,
    weekdays: number[]
}

type DaysMonthly = {
    type: "days",
    frequency: "monthly",
    interval: number,
    days: number[]
}

type WeekdayMonthly = {
    type: "weekday",
    frequency: "monthly",
    interval: number,
    ordinal: Ordinal
    weekday: number,
}

type Monthly = DaysMonthly | WeekdayMonthly

type DayYearly = {
    type: "day",
    frequency: "yearly",
    interval: number,
    months: number[],
    day: number
}

type WeekdayYearly = {
    type: "day",
    frequency: "yearly",
    interval: number,
    months: number[],
    ordinal: Ordinal,
    weekday: number
}

type Yearly = DayYearly | WeekdayYearly

{
    "frequency": "yearly",
    "interval": 1,
    "days": [1]
}

export type Repeat = Daily | Weekly | Monthly | Yearly

type BaseItem = {
    id: number,
    user: SimpleUser,
    name: string,
    created: string, // ISO 8601 datetime
    updated: string // ISO 8601 datetime
}

export type Step = {
    id: number,
    name: string,
    notes: string,
    duration: number, // minutes
    completed?: string // ISO 8601 datetime
}

export type Task = BaseItem & {
    type: "task",
    description: string, // The description for the AI prompt
    steps: Step[],
    deadline?: string, // ISO 8601 datetime
    urgency: number, // 0.00-1.00
    importance: number, // 0.00-1.00
    priority: number // 0.00-1.00
}

export type Event = BaseItem & {
    type: "event",
    notes?: string,
    starts: string // ISO 8601 datetime,
    ends: string // ISO 8601 datetime
    repeat?: Repeat
}

type Item = Task | Event

export default Item
// occurrences
// occurs

type SingeEvent = {
    starts: string,
    duration: 90
}

type RepeatEvent = {
    
    duration: 90
}