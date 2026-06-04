"use client"
import Timeline from "../Timeline"
import { EventOccurrence } from "@/types/Event"

export default function DateEvents({ events, day }: {
    events: EventOccurrence[],
    day: Date
}) {
    return (
        <Timeline
            date={day}
            blocks={events.map(occurrence => ({
                starts: occurrence.starts,
                ends: occurrence.ends,
                label: occurrence.event.name
            }))}
            points={[]}
        />
    )
}