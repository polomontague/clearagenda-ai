"use client"
import Form from "../Form"
import FieldFrame from "../FieldFrame"
import TextInput from "../TextInput"
import { useState, useEffect } from "react"
import Fieldset from "../Fieldset"
import SelectBar from "../SelectBar"
import LabelField from "../LabelField"
import InnerButton from "../InnerButton"
import Utility from "@/lib/Utility"
import SlideField from "../SlideField"
import Repeat from "../Repeat"
import RepeatType from "@/types/Repeat"
import API from "@/lib/API"
import { DoneButton } from "@/components/FormModal"
import Alert from "../Alert"
import DEFAULTS from "./DEFAULTS"
import Reminder from "@/types/Reminder"
import Loading from "../Loading"
import Collapses, { Collapse } from "../Collapses"
import DatePicker from "../DatePicker"
import TimePicker from "../TimePicker"

type BaseProps = {
    onSuccess: (reminder: Reminder) => void
}

type NewProps = BaseProps & {
    mode: "new"
}

type EditProps = BaseProps & {
    mode: "edit",
    reminder: Reminder
}

type ReminderFormProps = NewProps | EditProps

export default function ReminderForm(props: ReminderFormProps) {
    const [name, setName] = useState(DEFAULTS.name)
    const [occurs, setOccurs] = useState<"once" | "repeating">(DEFAULTS.occurs)
    const [at, setAt] = useState(DEFAULTS.at)
    const [repeat, setRepeat] = useState<RepeatType>(DEFAULTS.repeat)
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [open, setOpen] = useState<"once_at_date" | "once_at_time" | "repeating_at" | undefined>(undefined)

    useEffect(() => {
        if (props.mode === "edit") {
            setName(props.reminder.name)
            setOccurs(props.reminder.occurs)
            setAt(props.reminder.occurs === "once" ? Utility.loadLocalDateTime(props.reminder.at) : Utility.loadLocalTime(props.reminder.at))
            if ("repeat" in props.reminder) setRepeat(props.reminder.repeat)
        }
    }, [props.mode === "edit" ? props.reminder : null])

    useEffect(() => {
        setDoneDisabled(!validate())
    }, [name, occurs, at, repeat])

    const validate = (): boolean => {
        if (!name) return false
        return true
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.mode === "new" ? "post" : "put"
        const body = {
            occurs,
            name,
            at: occurs === "once" ? Utility.getDateTimeKey(at) : Utility.getTimeKey(at),
            repeat: occurs === "once" ? repeat : undefined
        }
        API[method]<{ reminder: Reminder }>("/api/v1/reminders", body, true).then(data => {
            setLoading(false)
            if (props.mode === "new") clear()
            props.onSuccess(data.reminder)
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    const clear = () => {
        setName(DEFAULTS.name)
        setOccurs(DEFAULTS.occurs)
        setAt(DEFAULTS.at)
        setRepeat(DEFAULTS.repeat)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Collapses value={open}>
                <FieldFrame>
                    <TextInput placeholder="Name..." value={name} onChange={setName} />
                    <Fieldset
                        description={occurs === "repeating" ? Utility.getRepeatLabel(repeat) : undefined}
                    >
                        <SelectBar
                            fieldset
                            options={[
                                { value: "once", label: "Once" },
                                { value: "repeating", label: "Repeating" }
                            ] as const}
                            value={occurs}
                            onChange={setOccurs}
                        />
                        {occurs === "once" ? (
                            <>
                                <LabelField fieldset label="At">
                                    <InnerButton
                                        label={Utility.formatDate(at)}
                                        onClick={() => setOpen(open === "once_at_date" ? undefined : "once_at_date")}
                                    />
                                    <InnerButton
                                        label={Utility.formatTime(at)}
                                        onClick={() => setOpen(open === "once_at_time" ? undefined : "once_at_time")}
                                    />
                                </LabelField>
                                <Collapse value="once_at_date">
                                    <DatePicker fieldset value={at} onChange={setAt} />
                                </Collapse>
                                <Collapse value="once_at_time">
                                    <TimePicker fieldset value={at} onChange={(setAt)} />
                                </Collapse>
                            </>
                        ) : occurs === "repeating" ? (
                            <>
                                <LabelField fieldset label="At">
                                    <InnerButton
                                        label={Utility.formatTime(at)}
                                        onClick={() => setOpen(open === "repeating_at" ? undefined : "repeating_at")}
                                    />
                                </LabelField>
                                <Collapse value="repeating_at">
                                    <TimePicker fieldset value={at} onChange={setAt} />
                                </Collapse>
                                <SlideField fieldset label="Repeat" value={Utility.getShortRepeatLabel(repeat)}>
                                    <Repeat value={repeat} onChange={setRepeat} />
                                </SlideField>
                            </>
                        ) : null}
                    </Fieldset>
                </FieldFrame>
            </Collapses>
            <Loading loading={loading} />
            <Alert message={alertMessage} open={alertOpen} onRequestClose={() => setAlertOpen(false)} />
            <DoneButton disabled={doneDisabled} />
        </Form>
    )
}