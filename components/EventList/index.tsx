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
import EventModal from "../EventModal"
import Button from "../Button"
import Events from "@/lib/Events"
import FormModal from "../FormModal"
import EventForm from "../EventForm"
import EventsContext from "@/contexts/EventsContext"
import Utility from "@/lib/Utility"
import Fieldset from "../Fieldset"
import Confirm from "../Confirm"
import Alert from "../Alert"
import API from "@/lib/API"

type EventListProps = {
    events: Event[]
}

export default function EventList(props: EventListProps) {
    const { user } = useContext(UserContext)
    const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const { updateEvent, removeEvent } = useContext(EventsContext)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)

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

    const handleDeleteClick = (event: Event) => {
        setCurrentEvent(event)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = (event: Event) => {
        setDeleteConfirmOpen(false)
        API.delete<{ event: Event }>(`/api/v1/events/${event.id}`, true).then(data => {
            removeEvent(data.event)
            setAlertMessage(`"${data.event.name}" Deleted Successfully!`)
            setAlertOpen(true)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
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
                                        onClick: () => handleDeleteClick(event)
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    <Fieldset
                                        description={event.occurs === "repeating" ? Utility.getRepeatLabel(event.repeat) : undefined}
                                    >
                                        <LabelField fieldset label="From">
                                            <InnerValue label={Events.getFrom(event)} />
                                        </LabelField>
                                    </Fieldset>
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
                    <Confirm
                        message={`Delete "${currentEvent.name}"?`}
                        open={deleteConfirmOpen}
                        onRequestCancel={() => setDeleteConfirmOpen(false)}
                        onRequestConfirm={() => handleDeleteConfirm(currentEvent)}
                    />
                </>
            ) : null}
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </>
    )
}