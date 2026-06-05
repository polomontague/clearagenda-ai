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
import SlideField from "../SlideField"
import DurationSelect from "../DurationSelect"
import RepeatPicker from "../RepeatPicker"
import TextArea from "../TextArea"
import RepeatType from "@/types/Repeat"
import Loading from "../Loading"
import { DoneButton } from "@/components/FormModal"
import API from "@/lib/API"
import Event from "@/types/Event"
import Alert from "../Alert"
import DEFAULTS from "./DEFAULTS"
import Collapses, { Collapse } from "../Collapses"
import DatePicker from "../DatePicker"
import TimePicker from "../TimePicker"
import TimezonePicker from "../TimezonePicker"
import InnerValue from "../InnerValue"

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
    const [open, setOpen] = useState<"once_starts_date" | "once_starts_time" | "repeating_starts" | undefined>(undefined)

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

    const getTimezoneLabel = (timezone: string) => timezone.split("/")[1].split("_").join(" ")

    const handleSubmit = () => {
        setLoading(true)
        const method = props.mode === "new" ? "post" : "put"
        const route = props.mode === "new" ? "/api/v1/events" : `/api/v1/events/${props.event.id}`
        const body = {
            occurs,
            name,
            starts: occurs === "once" ? starts.toISOString() : Utility.getTimeKey(starts),
            duration,
            timezone,
            repeat: occurs === "repeating" ? repeat : undefined
        }
        API[method]<{ event: Event }>(route, body, true).then(data => {
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

    const renderTimezone = () => {
        return (
            <SlideField
                fieldset
                label="Timezone"
                value={getTimezoneLabel(timezone)}
            >
                <Fieldset>
                    <LabelField fieldset label="Timezone">
                        <InnerValue label={getTimezoneLabel(timezone)} />
                    </LabelField>
                    <TimezonePicker fieldset value={timezone} onChange={setTimezone} />
                </Fieldset>
            </SlideField>
        )
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Collapses value={open}>
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
                                        onClick={() => setOpen(open === "once_starts_date" ? undefined : "once_starts_date")}
                                    />
                                    <InnerButton
                                        label={Utility.formatTime(starts)}
                                        onClick={() => setOpen(open === "once_starts_time" ? undefined : "once_starts_time")}
                                    />
                                </LabelField>
                                <Collapse value="once_starts_date">
                                    <DatePicker fieldset value={starts} onChange={setStarts} />
                                </Collapse>
                                <Collapse value="once_starts_time">
                                    <TimePicker fieldset value={starts} onChange={setStarts} />
                                </Collapse>
                                <SlideField fieldset label="Length" value={Utility.formatDuration(duration)}>
                                    <DurationSelect value={duration} onChange={setDuration} />
                                </SlideField>
                                {renderTimezone()}
                            </>
                        ) : occurs === "repeating" ? (
                            <>
                                <LabelField fieldset label="Starts">
                                    <InnerButton
                                        label={Utility.formatTime(starts)}
                                        onClick={() => setOpen(open === "repeating_starts" ? undefined : "repeating_starts")}
                                    />
                                </LabelField>
                                <Collapse value="repeating_starts">
                                    <TimePicker fieldset value={starts} onChange={setStarts} />
                                </Collapse>
                                <SlideField fieldset label="Length" value={Utility.formatDuration(duration)}>
                                    <DurationSelect value={duration} onChange={setDuration} />
                                </SlideField>
                                {renderTimezone()}
                                <SlideField fieldset label="Repeat" value={Utility.getShortRepeatLabel(repeat)}>
                                    <RepeatPicker timezone={timezone} value={repeat} onChange={setRepeat} />
                                </SlideField>
                            </>
                        ) : null}
                    </Fieldset>
                    <TextArea rows={6} placeholder="Notes..." value={notes} onChange={setNotes} />
                </FieldFrame>
            </Collapses>
            <Loading loading={loading} />
            <Alert message={alertMessage} open={alertOpen} onRequestClose={() => setAlertOpen(false)} />
            <DoneButton disabled={doneDisabled} />
        </Form>
    )
}