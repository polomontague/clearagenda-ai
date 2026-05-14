"use client"
import { useState, useEffect, ReactNode } from "react"
import API from "@/lib/API"
import EventsContext from "@/contexts/EventsContext"
import Event from "@/types/Event"

export default function EventsProvider(props: {
    children: ReactNode
}) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get<{ events: [] }>("/api/v1/events", true).then(data => {
            setEvents(data.events)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const addEvent = (event: Event) => {
        setEvents([ ...events, event ])
    }

    const updateEvent = (event: Event) => {
        const newEvents = [ ...events ]
        const index = newEvents.findIndex(event2 => event2.id === event.id)
        newEvents[index] = event
        setEvents(newEvents)
    }

    const removeEvent = (event: Event) => {
        const newEvents = events.filter(event2 => event2.id !== event.id)
        setEvents(newEvents)
    }

    return (
        <EventsContext.Provider
            value={{
                events,
                addEvent,
                updateEvent,
                removeEvent,
                loading
            }}
        >
            {props.children}
        </EventsContext.Provider>
    )
}