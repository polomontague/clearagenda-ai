import prisma from "@/lib/prisma"
import { OnceReminder, RepeatingReminder } from "@/types/Reminder"
import assembleReminder from "./assembleReminder"
import remindersBaseQuery from "./remindersBaseQuery"

type OnceReminderData = Pick<OnceReminder, "occurs" | "name" | "at">

type RepeatingReminderData = Pick<RepeatingReminder, "occurs" | "name" | "at" | "repeat">

type BaseReminderData = OnceReminderData | RepeatingReminderData

type CreateReminderData = BaseReminderData & {
    user_id: number
}

type UpdateReminderData = BaseReminderData

type GetRemindersOptions = {
    user_id?: number
}
const RemindersDAO = {
    createReminder: async (data: CreateReminderData) => {
        const result = await prisma.reminders.create({
            data: {
                occurs: data.occurs,
                user_id: data.user_id,
                name: data.name,
                once_at: data.occurs === "once" ? data.at : undefined,
                repeating_at: data.occurs === "repeating" ? data.at : undefined,
                repeat: "repeat" in data ? data.repeat : undefined
            },
            ...remindersBaseQuery
        })
        return assembleReminder(result)
    },
    getReminders: async (options: GetRemindersOptions) => {
        const result = await prisma.reminders.findMany({
            where: {
                user_id: options.user_id
            },
            ...remindersBaseQuery
        })
        return result.map(result => assembleReminder(result))
    }
}

export default RemindersDAO