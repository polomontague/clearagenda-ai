import SimpleUser from "./SimpleUser"
import Repeat from "./Repeat"

type BaseEvent = {
    type: "event",
    id: number,
    user: SimpleUser,
    name: string,
    notes?: string,
    duration: number,
    timezone: string,
    created: string,
    updated: string
}

export type OnceEvent = BaseEvent & {
    occurs: "once",
    starts: string
}

export type RepeatingEvent = BaseEvent & {
    occurs: "repeating",
    starts: string,
    repeat: Repeat
}

type Event = OnceEvent | RepeatingEvent

export type EventOccurrence = {
    event: Event,
    starts: Date,
    ends: Date
}

export default Event