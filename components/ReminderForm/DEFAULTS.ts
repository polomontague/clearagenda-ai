import Utility from "@/lib/Utility"

const DEFAULTS = {
    name: "",
    occurs: "once" as const,
    at: Utility.roundTime(new Date()),
    repeat: {
        frequency: "daily",
        interval: 1,
        starts: Utility.getDateKey(new Date())
    } as const
}

export default DEFAULTS