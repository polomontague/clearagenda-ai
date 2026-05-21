import SimpleUser from "./SimpleUser"
import Repeat from "./Repeat"

type BaseReminder = {
    type: "reminder",
    id: number,
    user: SimpleUser,
    name: string,
    at: string
}

export type OnceReminder = BaseReminder & {
    occurs: "once"
}

export type RepeatingReminder = BaseReminder & {
    occurs: "repeating",
    repeat: Repeat
}

type Reminder = OnceReminder | RepeatingReminder

export default Reminder