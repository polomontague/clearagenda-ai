import prisma from "@/lib/prisma"
import { OnceEvent, RepeatingEvent } from "@/types/Event"
import eventsBaseQuery from "./eventsBaseQuery"
import assembleEvent from "./assembleEvent"

type OnceEventData = Pick<OnceEvent, "occurs" | "name" | "notes" | "starts" | "duration" | "timezone">

type RepeatingEventData = Pick<RepeatingEvent, "occurs" | "name" | "notes" | "starts" | "duration" | "repeat" | "timezone">

type BaseEventData = OnceEventData | RepeatingEventData

type CreateEventData = BaseEventData & {
    user_id: number
}

type UpdateEventData = BaseEventData

type GetEventsOptions = {
    user_id: number
}

const EventsDAO = {
    createEvent: async (data: CreateEventData) => {
        const result = await prisma.events.create({
            data: {
                occurs: data.occurs,
                user_id: data.user_id,
                name: data.name,
                notes: data.notes,
                duration: data.duration,
                once_starts: data.occurs === "once" ? data.starts : undefined,
                repeating_starts: data.occurs === "repeating" ? data.starts : undefined,
                timezone: data.timezone,
                repeat: "repeat" in data ? data.repeat : undefined
            },
            ...eventsBaseQuery
        })
        return assembleEvent(result)
    },
    getEvents: async (options: GetEventsOptions) => {
        const result = await prisma.events.findMany({
            where: {
                user_id: options.user_id
            },
            ...eventsBaseQuery
        })
        return result.map(result => assembleEvent(result))
    },
    getEventById: async (eventId: number) => {
        const result = await prisma.events.findUnique({
            where: {
                id: eventId
            },
            ...eventsBaseQuery
        })
        return result ? assembleEvent(result) : undefined
    },
    deleteEvent: async (eventId: number) => {
        const result = await prisma.events.delete({
            where: {
                id: eventId
            },
            ...eventsBaseQuery
        })
        return assembleEvent(result)
    }
}

export default EventsDAO