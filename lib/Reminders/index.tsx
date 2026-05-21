import Reminder from "@/types/Reminder"
import Utility from "../Utility"
import User from "@/types/User"
import getAt from "./getAt"
import getDateReminders from "./getDateReminders"
import getStatus from "./getStatus"

const Reminders = {
    getAt,
    getDateReminders,
    getStatus
}

export default Reminders