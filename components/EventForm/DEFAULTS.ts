import Utility from "@/lib/Utility"
import { DateTime } from "luxon"

const DEFAULTS = {
    name: "",
    occurs: "once" as const,
    starts: Utility.roundTime(new Date()),
    duration: 60,
    timezone: DateTime.local().zoneName,
    repeat: {
        frequency: "daily",
        interval: 1,
        starts: Utility.getDateKey(new Date())
    } as const,
    notes: ""
}

export default DEFAULTS