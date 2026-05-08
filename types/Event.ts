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

type OnceEvent = BaseEvent & {
    occurs: "once",
    starts: string
}

type RepeatingEvent = BaseEvent & {
    occurs: "repeating",
    starts: string,
    repeat: Repeat
}

type Event = OnceEvent | RepeatingEvent

export default Event