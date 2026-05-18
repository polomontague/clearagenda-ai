"use client"
import { useContext, useMemo } from "react"
import EventsContext from "@/contexts/EventsContext"
import Events from "@/lib/Events"
import Timeline from "../Timeline"

export default function DateEvents({ date }: {
    date: Date
}) {
    const { events } = useContext(EventsContext)
    const dateEvents = useMemo(() => Events.getDateEvents(events, date), [events, date])

    return (
        <Timeline events={dateEvents} />
    )
}