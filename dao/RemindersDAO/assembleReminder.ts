import assembleSimpleUser from "../UsersDAO/assembleSimpleUser"
import { Prisma } from "@/lib/prisma"
import remindersBaseQuery from "./remindersBaseQuery"
import Reminder, { OnceReminder, RepeatingReminder } from "@/types/Reminder"
import Repeat from "@/types/Repeat"

type ReminderResult = Prisma.remindersGetPayload<typeof remindersBaseQuery>

const assembleOnceReminder = (result: ReminderResult): OnceReminder => {
    return {
        type: "reminder",
        occurs: "once",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        at: result.once_at ? result.once_at : ""
    }
}

const assembleRepeatingReminder = (result: ReminderResult): RepeatingReminder => {
    return {
        type: "reminder",
        occurs: "repeating",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        at: result.repeating_at ? result.repeating_at : "",
        repeat: result.repeat as Repeat
    }
}

const assembleReminder = (result: ReminderResult): Reminder => {
    return result.occurs === "once" ? assembleOnceReminder(result)
        : assembleRepeatingReminder(result)
}

export default assembleReminder