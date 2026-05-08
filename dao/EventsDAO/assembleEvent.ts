import assembleSimpleUser from "../UsersDAO/assembleSimpleUser"
import Event, { OnceEvent, RepeatingEvent } from "@/types/Event"
import { Prisma } from "@/lib/prisma"
import eventsBaseQuery from "./eventsBaseQuery"
import Repeat from "@/types/Repeat"

type EventResult = Prisma.eventsGetPayload<typeof eventsBaseQuery>

const assembleOnceEvent = (result: EventResult): OnceEvent => {
    return {
        type: "event",
        occurs: "once",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        notes: result.notes ? result.notes : undefined,
        starts: result.once_starts ? result.once_starts.toISOString() : "",
        duration: result.duration,
        timezone: result.timezone,
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

const assembleRepeatingEvent = (result: EventResult): RepeatingEvent => {
    return {
        type: "event",
        occurs: "repeating",
        id: result.id,
        user: assembleSimpleUser(result.user),
        name: result.name,
        notes: result.notes ? result.notes : undefined,
        starts: result.repeating_starts ? result.repeating_starts : "",
        duration: result.duration,
        timezone: result.timezone,
        repeat: result.repeat as Repeat,
        created: result.created.toISOString(),
        updated: result.updated.toISOString()
    }
}

const assembleEvent = (result: EventResult): Event => {
    return result.occurs === "once" ? assembleOnceEvent(result)
        : assembleRepeatingEvent(result)
}

export default assembleEvent