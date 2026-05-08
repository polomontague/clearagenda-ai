import SimpleUser from "./SimpleUser"
import Repeat from "./Repeat"

type BaseReminder = {
    id: number,
    user: SimpleUser,
    name: string,
    at: string
}

type OnceReminder = BaseReminder & {
    occurs: "once"
}

type RepeatingReminder = BaseReminder & {
    occurs: "repeating",
    repeat: Repeat
}

type Reminder = OnceReminder | RepeatingReminder

export default Reminder