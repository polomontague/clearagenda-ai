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

    return (
        <Timeline
            blocks={dateEvents.map(occurrence => ({
                starts: occurrence.starts,
                ends: occurrence.ends,
                label: occurrence.event.name
            }))}
            points={[]}
        />
    )
}