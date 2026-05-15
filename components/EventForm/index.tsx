"use client"
import { useState, useEffect } from "react"
import Form from "../Form"
import TextInput from "../TextInput"
import FieldFrame from "../FieldFrame"
import Fieldset from "../Fieldset"
import SelectBar from "../SelectBar"
import LabelField from "../LabelField"
import InnerButton from "../InnerButton"
import Utility from "@/lib/Utility"
import { Option, Slide } from "@/components/FormModal"
import DurationSelect from "../DurationSelect"
import Repeat from "../Repeat"
import TextArea from "../TextArea"
import RepeatType from "@/types/Repeat"
import Loading from "../Loading"
import { DoneButton } from "@/components/FormModal"
import API from "@/lib/API"
import Event from "@/types/Event"
import Alert from "../Alert"
import DEFAULTS from "./DEFAULTS"

type BaseProps = {
    onSuccess: (event: Event) => void
}

type NewProps = BaseProps & {
    mode: "new"
}

type EditProps = BaseProps & {
    mode: "edit",
    event: Event
}

type EventFormProps = NewProps | EditProps

export default function EventForm(props: EventFormProps) {
    const [name, setName] = useState(DEFAULTS.name)
    const [occurs, setOccurs] = useState<"once" | "repeating">(DEFAULTS.occurs)
    const [starts, setStarts] = useState(DEFAULTS.starts)
    const [duration, setDuration] = useState(DEFAULTS.duration)
    const [timezone, setTimezone] = useState(DEFAULTS.timezone)
    const [repeat, setRepeat] = useState<RepeatType>(DEFAULTS.repeat)
    const [notes, setNotes] = useState(DEFAULTS.notes)
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)

    useEffect(() => {
        if (props.mode === "edit") {
            setName(props.event.name)
            setOccurs(props.event.occurs)
            setStarts(props.event.occurs === "once" ? new Date(props.event.starts) : Utility.loadLocalTime(props.event.starts))
            setDuration(props.event.duration)
            setTimezone(props.event.timezone)
            if ("repeat" in props.event) setRepeat(props.event.repeat)
            setNotes(props.event.notes ?? "")
        }
    }, [props.mode === "edit" ? props.event : null])

    useEffect(() => {
        setDoneDisabled(!validate(name))
    }, [name])

    const validate = (name: string): boolean => {
        if (!name) return false
        return true
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.mode === "new" ? "post" : "put"
        const body = {
            occurs,
            name,
            starts: occurs === "once" ? starts.toISOString() : Utility.formatTime(starts),
            duration,
            timezone,
            repeat: occurs === "once" ? repeat : undefined
        }
        API[method]<{ event: Event }>("/api/v1/events", body, true).then(data => {
            setLoading(false)
            if (props.mode === "new") clear()
            props.onSuccess(data.event)
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    const clear = () => {
        setName(DEFAULTS.name)
        setOccurs(DEFAULTS.occurs)
        setStarts(DEFAULTS.starts)
        setDuration(DEFAULTS.duration)
        setTimezone(DEFAULTS.timezone)
        setRepeat(DEFAULTS.repeat)
        setNotes(DEFAULTS.notes)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <TextInput placeholder="Name..." value={name} onChange={setName} />
                <Fieldset
                    description={occurs === "repeating" ? Utility.getRepeatLabel(repeat, timezone) : undefined}
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
                            <LabelField fieldset label="Starts">
                                <InnerButton
                                    label={Utility.formatDate(starts)}
                                    onClick={() => {}}
                                />
                                <InnerButton
                                    label={Utility.formatTime(starts)}
                                    onClick={() => {}}
                                />
                            </LabelField>
                            <Option fieldset label="Length" value={Utility.formatDuration(duration)}>
                                <Slide>
                                    <DurationSelect value={duration} onChange={setDuration} />
                                </Slide>
                            </Option>
                        </>
                    ) : occurs === "repeating" ? (
                        <>
                            <LabelField fieldset label="Starts">
                                <InnerButton
                                    label={Utility.formatTime(starts)}
                                    onClick={() => {}}
                                />
                            </LabelField>
                            <Option fieldset label="Length" value={Utility.formatDuration(duration)}>
                                <Slide>
                                    <DurationSelect value={duration} onChange={setDuration} />
                                </Slide>
                            </Option>
                            <Option fieldset label="Repeat" value={Utility.getShortRepeatLabel(repeat)}>
                                <Slide>
                                    <Repeat timezone={timezone} value={repeat} onChange={setRepeat} />
                                </Slide>
                            </Option>
                        </>
                    ) : null}
                </Fieldset>
                <TextArea rows={6} placeholder="Notes..." value={notes} onChange={setNotes} />
                <Loading loading={loading} />
                <Alert message={alertMessage} open={alertOpen} onRequestClose={() => setAlertOpen(false)} />
                <DoneButton disabled={doneDisabled} />
            </FieldFrame>
        </Form>
    )
}