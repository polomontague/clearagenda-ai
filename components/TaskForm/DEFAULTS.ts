import Utility from "@/lib/Utility"

const DEFAULTS = {
    description: "",
    occurs: "once" as const,
    hasDeadline: false,
    onceDeadline: new Date(),
    repeatingDeadline: 1,
    repeat: {
        frequency: "daily",
        interval: 1,
        starts: Utility.getDateKey(new Date())
    } as const,
    experience: 0
}

export default DEFAULTS