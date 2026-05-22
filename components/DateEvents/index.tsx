"use client"
import { useContext, useMemo } from "react"
import EventsContext from "@/contexts/EventsContext"
import Events from "@/lib/Events"
import Timeline, { Block } from "../Timeline"
import Event from "@/types/Event"

export default function DateEvents({ date }: {
    date: Date
}) {
    const { events } = useContext(EventsContext)
    const dateEvents = useMemo(() => Events.getDateEvents(events, date), [events, date])

    const eventToBlock = (event: Event): Block => {
        if (event.occurs === "once") {
            const ends = new Date(event.starts)
            ends.setMinutes(ends.getMinutes() + event.duration)
            return {
                starts: new Date(event.starts),
                ends,
                label: event.name
            }
        } else { // Repeating
            return {
                starts: new Date(),
                ends: new Date(),
                label: event.name
            }
        }
    }

    return (
        <Timeline
            blocks={dateEvents.map(event => eventToBlock(event))}
            points={[]}
        />
    )
}