"use client"
import Form from "@/components/Form"
import Item from "@/types/Item"
import { useState, useEffect } from "react"
import TextArea from "@/components/TextArea"
import FieldFrame from "@/components/FieldFrame"
import { DoneButton } from "@/components/FormModal"
import Alert from "@/components/Alert"
import Fieldset from "@/components/Fieldset"
import API from "@/lib/API"
import Loading from "@/components/Loading"
import SelectBar from "@/components/SelectBar"
import Collapses from "@/components/Collapses"
import TextInput from "@/components/TextInput"
import getRepeat from "./getRepeat"
import DEFAULTS from "./DEFAULTS"
import populate from "./populate"
import clear from "./clear"
import renderOccurs from "./renderOccurs"

type BaseProps = {
    onSuccess: (item: Item) => void
}

type NewProps = BaseProps & {
    type: "new"
}

type EditProps = BaseProps & {
    type: "edit",
    item: Item
}

type ItemFormProps = NewProps | EditProps

export default function ItemForm(props: ItemFormProps) {
    const [type, setType] = useState<"task" | "event">(DEFAULTS.type)
    const [description, setDescription] = useState(DEFAULTS.description)
    const [hasDeadline, setHasDeadline] = useState(DEFAULTS.has_deadline)
    const [deadline, setDeadline] = useState(DEFAULTS.deadline)
    const [name, setName] = useState(DEFAULTS.name)
    const [starts, setStarts] = useState(DEFAULTS.starts)
    const [duration, setDuration] = useState(DEFAULTS.duration)
    const [occurs, setOccurs] = useState<"once" | "repeating">(DEFAULTS.occurs)
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">(DEFAULTS.frequency)
    const [interval, setInterval] = useState(DEFAULTS.interval)
    const [ordinal, setOrdinal] = useState<1 | 2 | 3 | 4 | 5 | -2 | -1>(DEFAULTS.ordinal)
    const [weekday, setWeekday] = useState(DEFAULTS.weekday)
    const [weekdays, setWeekdays] = useState(DEFAULTS.weekdays)
    const [monthlyType, setMonthlyType] = useState<"days" | "weekday">(DEFAULTS.monthly_type)
    const [days, setDays] = useState(DEFAULTS.days)
    const [yearlyType, setYearlyType] = useState<"day" | "weekday">(DEFAULTS.yearly_type)
    const [months, setMonths] = useState(DEFAULTS.months)
    const [day, setDay] = useState(DEFAULTS.day)
    const [repeatStart, setRepeatStart] = useState(DEFAULTS.repeat_start)
    const [notes, setNotes] = useState(DEFAULTS.notes)
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState<string>()

    useEffect(() => {
        if (props.type === "edit") populate(props.item, {
            setType,
            setDescription,
            setHasDeadline,
            setDeadline,
            setName,
            setStarts,
            setDuration,
            setOccurs,
            setFrequency,
            setInterval,
            setOrdinal,
            setWeekday,
            setWeekdays,
            setMonthlyType,
            setDays,
            setMonths,
            setYearlyType,
            setDay,
            setRepeatStart,
            setNotes
        })
    }, [ props.type === "edit" ? props.item : null ])

    useEffect(() => {
        setDoneDisabled(!validate())
    }, [description, name])

    const validate = () => {
        if (type === "task") {
            if (!description) return false
        }
        if (type === "event") {
            if (!name) return false
        }
        return true
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.type === "new" ? "post" : "put"
        const endpoint = `/api/v1/items${props.type === "edit" ? `/${props.item.id}` : ""}`
        const repeat = getRepeat({ frequency, repeatStart, interval, weekdays, monthlyType, days, ordinal, weekday, yearlyType, months, day })
        const body = type === "task" ? (
            occurs === "once" ? {
                type,
                description,
                occurs,
                deadline: hasDeadline ? deadline.toISOString() : undefined
            } : occurs == "repeating" ? {
                type,
                description,
                deadline: hasDeadline ? deadline.toISOString() : undefined,
                occurs,
                repeat
            } : {}
        ) : type === "event" ? (
            occurs === "once" ? {
                type: "event",
                name,
                notes: notes || undefined,
                duration,
                occurs,
                starts
            } : occurs === "repeating" ? {
                type: "event",
                name,
                notes: notes || undefined,
                duration,
                occurs,
                starts: starts.toISOString(),
                repeat
            } : {}
        ) : {}
        API[method]<{ item: Item }>(endpoint, body, true).then(data => {
            setLoading(false)
            if (props.type === "new") clear({
                setType,
                setDescription,
                setHasDeadline,
                setDeadline,
                setName,
                setStarts,
                setDuration,
                setOccurs,
                setFrequency,
                setInterval,
                setOrdinal,
                setWeekday,
                setWeekdays,
                setMonthlyType,
                setDays,
                setMonths,
                setYearlyType,
                setDay,
                setRepeatStart,
                setNotes
            })
            props.onSuccess(data.item)
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Collapses value={open}>
                <FieldFrame>
                    <SelectBar
                        options={[
                            { value: "task", label: "Task" },
                            { value: "event", label: "Event" }
                        ] as const}
                        value={type}
                        onChange={(val) => setType(val)}
                    />
                    {type === "task" ? (
                        <>
                            <Fieldset
                                description="Our AI breaks down tasks into actionable steps, and estimates importance and duration."
                            >
                                <TextArea fieldset rows={8} placeholder="Describe the task..." value={description} onChange={(val) => setDescription(val)} />
                            </Fieldset>
                            {renderOccurs({ type, occurs, hasDeadline, deadline, frequency, repeatStart, days, day, weekday, interval, weekdays, monthlyType, ordinal, yearlyType, months, open, starts, duration }, { setOccurs, setOpen, setHasDeadline, setDeadline, setStarts, setDuration, setFrequency, setInterval, setRepeatStart, setWeekday, setWeekdays, setMonthlyType, setDays, setOrdinal, setYearlyType, setMonths, setDay })}
                        </>
                    ) : type === "event" ? (
                        <>
                            <TextInput placeholder="Name..." value={name} onChange={setName} />
                            {renderOccurs({ type, occurs, hasDeadline, deadline, frequency, repeatStart, days, day, weekday, interval, weekdays, monthlyType, ordinal, yearlyType, months, open, starts, duration }, { setOccurs, setOpen, setHasDeadline, setDeadline, setStarts, setDuration, setFrequency, setInterval, setRepeatStart, setWeekday, setWeekdays, setMonthlyType, setDays, setOrdinal, setYearlyType, setMonths, setDay })}
                            <TextArea rows={6} placeholder="Notes..." value={notes} onChange={(val) => setNotes(val)} />
                        </>
                    ) : <></>}
                </FieldFrame>
            </Collapses>
            <Alert open={alertOpen} message={alertMessage} onRequestClose={() => setAlertOpen(false)} />
            <DoneButton disabled={doneDisabled || loading} />
            <Loading loading={loading} />
        </Form>
    )
}