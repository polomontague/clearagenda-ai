"use client"
import List, { ListItem } from "@/components/List"
import Event from "@/types/Event"
import Card from "@/components/Card"
import { EditIcon, TrashCanIcon } from "@/components/Icons"
import { useContext, useState } from "react"
import UserContext from "@/contexts/UserContext"
import FieldFrame from "@/components/FieldFrame"
import LabelField from "@/components/LabelField"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"
import EventModal from "../EventModal"
import Button from "../Button"
import Events from "@/lib/Events"
import FormModal from "../FormModal"
import EventForm from "../EventForm"
import EventsContext from "@/contexts/EventsContext"

type EventListProps = {
    events: Event[]
}

export default function EventList(props: EventListProps) {
    const { user } = useContext(UserContext)
    const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const { updateEvent } = useContext(EventsContext)

    const getFrom = (event: Event): string => {
        if (event.occurs === "once") {
            const starts = new Date(event.starts)
            const ends = new Date(starts)
            ends.setMinutes(ends.getMinutes() + event.duration)
            return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
        } else { // Repeating
            return ""
        }
    }

    const handleEditClick = (event: Event) => {
        setCurrentEvent(event)
        setEditModalOpen(true)
    }

    const handleEditSuccess = (event: Event) => {
        updateEvent(event)
        setEditModalOpen(false)
    }

    const handleEventClick = (event: Event) => {
        setCurrentEvent(event)
        setModalOpen(true)
    }

    if (!user) return

    return (
        <>
            <List>
                {props.events.map((event, i) => {
                    const status = Events.getStatus(event, user)
                    return (
                        <ListItem key={i}>
                            <Card
                                label={event.name}
                                buttons={[
                                    {
                                        icon: <EditIcon />,
                                        onClick: () => handleEditClick(event)
                                    },
                                    {
                                        icon: <TrashCanIcon />,
                                        onClick: () => {}
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    <LabelField label="From">
                                        <InnerValue label={getFrom(event)} />
                                    </LabelField>
                                    <LabelField label="Status">
                                        <InnerValue
                                            color={status.color}
                                            label={status.label}
                                        />
                                    </LabelField>
                                    <Button
                                        label="See Event"
                                        onClick={() => handleEventClick(event)}
                                    />
                                </FieldFrame>
                            </Card>
                        </ListItem>
                    )
                })}
            </List>
            {currentEvent ? (
                <>
                    <EventModal
                        event={currentEvent}
                        open={modalOpen}
                        onRequestClose={() => setModalOpen(false)}
                    />
                    <FormModal
                        label="Edit Event"
                        open={editModalOpen}
                        onRequestCancel={() => setEditModalOpen(false)}
                    >
                        <EventForm
                            mode="edit"
                            event={currentEvent}
                            onSuccess={handleEditSuccess}
                        />
                    </FormModal>
                </>
            ) : null}
        </>
    )
}