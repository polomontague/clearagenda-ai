"use client"
import { useContext, useMemo } from "react"
import Utility from "@/lib/Utility"
import Fieldset from "../Fieldset"
import Modal from "../Modal"
import Reminder from "@/types/Reminder"
import LabelField from "../LabelField"
import InnerValue from "../InnerValue"
import Reminders from "@/lib/Reminders"
import UserContext from "@/contexts/UserContext"
import FieldFrame from "../FieldFrame"

type ReminderModalProps = {
    reminder: Reminder,
    open: boolean,
    onRequestClose: () => void
}

export default function ReminderModal({ reminder, open, onRequestClose }: ReminderModalProps) {
    const { user } = useContext(UserContext)
    if (!user) return
    const at = useMemo(() => Reminders.getAt(reminder), [reminder])
    const status = useMemo(() => Reminders.getStatus(reminder, user), [reminder, user])
    
    return (
        <Modal label={reminder.name} open={open} onRequestClose={onRequestClose}>
            <FieldFrame>
                <LabelField label="Status">
                    <InnerValue  color={status.color} label={status.label} />
                </LabelField>
                <Fieldset
                    description={reminder.occurs === "repeating" ? Utility.getRepeatLabel(reminder.repeat) : undefined}
                >
                    <LabelField fieldset label="At">
                        {at.date ? (
                            <InnerValue label={at.date} />
                        ) : null}
                        <InnerValue label={at.time} />
                    </LabelField>
                </Fieldset>
            </FieldFrame>
        </Modal>
    )
}