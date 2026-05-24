"use client"
import { useContext, useMemo } from "react"
import Event from "@/types/Event"
import Modal from "../Modal"
import FieldFrame from "../FieldFrame"
import Fieldset from "../Fieldset"
import Utility from "@/lib/Utility"
import LabelField from "../LabelField"
import InnerValue from "../InnerValue"
import ValueBox from "../ValueBox"
import Events from "@/lib/Events"
import UserContext from "@/contexts/UserContext"

type EventModalProps = {
    event: Event,
    open: boolean,
    onRequestClose: () => void
}

export default function EventModal({ event, open, onRequestClose }: EventModalProps) {
    const { user } = useContext(UserContext)
    if (!user) return
    const status = useMemo(() => Events.getStatus(event, user), [event, user])

    return (
        <Modal label={event.name} open={open} onRequestClose={onRequestClose}>
            <FieldFrame>
                <LabelField label="Status">
                    <InnerValue  color={status.color} label={status.label} />
                </LabelField>
                <Fieldset
                    description={event.occurs === "repeating" ? Utility.getRepeatLabel(event.repeat, event.timezone) : undefined}
                >
                    <LabelField fieldset label="From">
                        <InnerValue label={Events.getFrom(event)} />
                    </LabelField>
                    {event.notes ? (
                        <Fieldset label="Notes">
                            <ValueBox value={event.notes} />
                        </Fieldset>
                    ) : null}
                </Fieldset>
            </FieldFrame>
        </Modal>
    )
}