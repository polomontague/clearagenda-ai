"use client"
import Utility from "@/lib/Utility"
import Fieldset from "../Fieldset"
import Modal from "../Modal"
import Reminder from "@/types/Reminder"
import LabelField from "../LabelField"
import InnerValue from "../InnerValue"
import Reminders from "@/lib/Reminders"

type ReminderModalProps = {
    reminder: Reminder,
    open: boolean,
    onRequestClose: () => void
}

export default function ReminderModal({ reminder, open, onRequestClose }: ReminderModalProps) {
    const at = Reminders.getAt(reminder)
    return (
        <Modal label={reminder.name} open={open} onRequestClose={onRequestClose}>
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
        </Modal>
    )
}