"use client"
import { useState } from "react"
import Timeline from "../Timeline"
import Event, { EventOccurrence } from "@/types/Event"
import EventModal from "../EventModal"

export default function DateEvents({ events, day }: {
    events: EventOccurrence[],
    day: Date
}) {
    const [currentEvent, setCurrentEvent] = useState<Event>()
    const [modalOpen, setModalOpen] = useState(false)

    const handleEventClick = (event: Event) => {
        setCurrentEvent(event)
        setModalOpen(true)
    }

    return (
        <>
            <Timeline
                date={day}
                blocks={events.map(occurrence => ({
                    starts: occurrence.starts,
                    ends: occurrence.ends,
                    label: occurrence.event.name,
                    onClick: () => handleEventClick(occurrence.event)
                }))}
                points={[]}
            />
            {currentEvent ? (
                <EventModal
                    event={currentEvent}
                    open={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                />
            ) : null}
        </>
    )
}