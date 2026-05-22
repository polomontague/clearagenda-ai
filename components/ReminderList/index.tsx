"use client"
import List, { ListItem } from "@/components/List"
import Reminder from "@/types/Reminder"
import Card from "@/components/Card"
import LabelField from "../LabelField"
import InnerValue from "../InnerValue"
import FieldFrame from "../FieldFrame"
import Reminders from "@/lib/Reminders"
import { useContext, useState } from "react"
import UserContext from "@/contexts/UserContext"
import ReminderModal from "../ReminderModal"
import Button from "../Button"
import { EditIcon, TrashCanIcon } from "../Icons"
import FormModal from "../FormModal"
import ReminderForm from "../ReminderForm"
import RemindersContext from "@/contexts/RemindersContext"

type ReminderListProps = {
    reminders: Reminder[]
}

export default function ReminderList(props: ReminderListProps) {
    const { user } = useContext(UserContext)
    const [currentReminder, setCurrentReminder] = useState<Reminder | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const { updateReminder } = useContext(RemindersContext)

    const handleEditClick = (reminder: Reminder) => {
        setCurrentReminder(reminder)
        setEditModalOpen(true)
    }

    const handleUpdateReminder = (reminder: Reminder) => {
        updateReminder(reminder)
        setEditModalOpen(false)
    }

    const handleReminderClick = (reminder: Reminder) => {
        setCurrentReminder(reminder)
        setModalOpen(true)
    }

    if (!user) return

    return (
        <>
            <List>
                {props.reminders.map((reminder, i) => {
                    const at = Reminders.getAt(reminder)
                    const status = Reminders.getStatus(reminder, user)
                    return (
                        <ListItem key={i}>
                            <Card
                                label={reminder.name}
                                buttons={[
                                    {
                                        icon: <EditIcon />,
                                        onClick: () => handleEditClick(reminder)
                                    },
                                    {
                                        icon: <TrashCanIcon />,
                                        onClick: () => {}
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    <LabelField label="At">
                                        {at.date ? (
                                            <InnerValue label={at.date} />
                                        ) : null}
                                        <InnerValue label={at.time} />
                                    </LabelField>
                                    <LabelField label="Status">
                                        <InnerValue
                                            color={status.color}
                                            label={status.label}
                                        />
                                    </LabelField>
                                    <Button
                                        label="See Reminder"
                                        onClick={() => handleReminderClick(reminder)}
                                    />
                                </FieldFrame>
                            </Card>
                        </ListItem>
                    )
                })}
            </List>
            {currentReminder ? (
                <>
                    <ReminderModal
                        reminder={currentReminder}
                        open={modalOpen}
                        onRequestClose={() => setModalOpen(false)}
                    />
                    <FormModal
                        label="Edit Reminder"
                        open={editModalOpen}
                        onRequestCancel={() => setEditModalOpen(false)}
                    >
                        <ReminderForm
                            mode="edit"
                            reminder={currentReminder}
                            onSuccess={handleUpdateReminder}
                        />
                    </FormModal>
                </>
            ) : null}
        </>
    )
}