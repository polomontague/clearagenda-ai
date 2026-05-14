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

type ReminderListProps = {
    reminders: Reminder[]
}

export default function ReminderList(props: ReminderListProps) {
    const { user } = useContext(UserContext)
    const [currentReminder, setCurrentReminder] = useState<Reminder | undefined>(undefined)
    const [modalOpen, setModalOpen] = useState(false)

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
                            <Card label={reminder.name}>
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
                <ReminderModal
                    reminder={currentReminder}
                    open={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                />
            ) : null}
        </>
    )
}