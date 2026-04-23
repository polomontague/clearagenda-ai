"use client"
import Form from "@/components/Form"
import Item from "@/types/Item"
import { useState, useEffect } from "react"
import TextArea from "@/components/TextArea"
import FieldFrame from "@/components/FieldFrame"
import { DoneButton } from "@/components/FormModal"
import Alert from "@/components/Alert"
import DatePicker from "@/components/DatePicker"
import Fieldset from "@/components/Fieldset"
import Toggle from "@/components/Toggle"
import LabelField from "@/components/LabelField"
import Utility from "@/lib/Utility"
import InnerValue from "@/components/InnerValue"
import API from "@/lib/API"
import Loading from "@/components/Loading"
import SelectBar from "@/components/SelectBar"
import TimePicker from "@/components/TimePicker"
import RangeInput from "../RangeInput"
import NthWeekdaySelect from "@/components/NthWeekdaySelect"
import Collapses, { Collapse } from "@/components/Collapses"
import InnerButton from "@/components/InnerButton"
import SelectList from "@/components/SelectList"
import TextInput from "@/components/TextInput"
import { Option, Slide } from "@/components/FormModal"
import DurationSelect from "@/components/DurationSelect"
import MultiSelect from "../MultiSelect"

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
    const [description, setDescription] = useState("")
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [hasDeadline, setHasDeadline] = useState(false)
    const [deadline, setDeadline] = useState(new Date())
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState("task")
    const [notes, setNotes] = useState("")
    const [starts, setStarts] = useState(new Date())
    const [ends, setEnds] = useState(new Date())
    const [duration, setDuration] = useState(15)
    const [frequency, setFrequency] = useState("daily")
    const [interval, setInterval] = useState(1)
    const [weekday, setWeekday] = useState({ ordinal: 0, weekday: 0 })
    const [monthlyType, setMonthlyType] = useState("dates")
    const [open, setOpen] = useState<string>()
    const [weekdays, setWeekdays] = useState([0])
    const [months, setMonths] = useState([0])
    const [name, setName] = useState("")
    const [repeat, setRepeat] = useState(false)
    const frequencyLabelMap: Record<string, string> = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }
    const [occurs, setOccurs] = useState<"once" | "repeat">("once")

    useEffect(() => {
        console.log(duration)
    }, [duration])

    useEffect(() => {
        if (props.type === "edit") {
            setType(props.item.type)
            if (props.item.type === "task") {
                setDescription(props.item.description)
                setHasDeadline(!!props.item.deadline)
                setDeadline(props.item.deadline ? new Date(props.item.deadline) : new Date())
                setNotes("")
                setStarts(new Date())
                setEnds(new Date())
            } else if (props.item.type === "event") {
                setDescription("")
                setHasDeadline(false)
                setDeadline(new Date())
                setNotes(props.item.notes ?? "")
                setStarts(new Date(props.item.starts))
                setEnds(new Date(props.item.ends))
            }
        }
    }, [ props.type === "edit" ? props.item : null ])

    useEffect(() => {
        setDoneDisabled(!validate())
    }, [description])

    const getIntervalLabel = (frequency: string, interval: number) => {
        const labelMap: Record<string, string> = {
            daily: "Day",
            weekly: "Week",
            monthly: "Month",
            yearly: "Year"
        }
        return `${interval > 1 ? `${interval} ` : ""}${labelMap[frequency]}${interval > 1 ? "s" : ""}`
    }

    const getWeekdaysLabel = (weekdays: number[]) => {
        const SHOW = 3
        const names = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
        if (weekdays.length === 7) return "Every Day"
        const remaining = weekdays.length - SHOW
        return `${weekdays.slice(0, SHOW).map(weekday => names[weekday]).join(", ")}${remaining ? ` +${remaining}` : ""}`
    }

    const getMonthsLabel = (months: number[]) => {
        const SHOW = 3
        const names = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        if (months.length === 12) return "Every Month"
        const remaining = months.length - SHOW
        return `${months.slice(0, SHOW).map(month => names[month]).join(", ")}${remaining ? ` +${remaining}` : ""}`
    }

    const validate = () => {
        let valid = true
        if (!description) valid = false
        return valid
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.type === "new" ? "post" : "put"
        const endpoint = `/api/v1/items${props.type === "edit" ? `/${props.item.id}` : ""}`
        const body = type === "task" ? {
            type: "task",
            description,
            deadline: hasDeadline ? deadline.toISOString() : undefined
        } : type === "event" ? {
            type: "event",
            notes: notes ? notes : undefined,
            starts: starts.toISOString(),
            ends: ends.toISOString()
        } : {}
        API[method]<{ item: Item }>(endpoint, body, true).then(data => {
            setLoading(false)
            if (props.type === "new") {
                setDescription("")
                setDeadline(new Date())
                setHasDeadline(false)
                setNotes("")
                setStarts(new Date())
                setEnds(new Date())
            }
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
                        ]}
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
                            <Fieldset
                                description="Deadlines are used to prioritize Agenda Items."
                            >
                                <LabelField fieldset label="Deadline">
                                    <Toggle on={hasDeadline} onChange={(val) => setHasDeadline(val)} />
                                </LabelField>
                                {hasDeadline ? (
                                    <>
                                        <LabelField fieldset label="Date">
                                            <InnerButton
                                                label={Utility.formatDate(deadline)}
                                                onClick={() => setOpen(open === "deadline" ? undefined : "deadline")}
                                            />
                                        </LabelField>
                                        <Collapse value="deadline">
                                            <DatePicker fieldset value={deadline} onChange={setDeadline} />
                                        </Collapse>
                                    </>
                                ) : null}
                            </Fieldset>
                        </>
                    ) : type === "event" ? (
                        <>
                            <TextInput placeholder="Name..." value={name} onChange={setName} />
                            <Fieldset>
                                <SelectBar
                                    fieldset
                                    options={[
                                        { value: "once", label: "One Time" },
                                        { value: "repeat", label: "Repeating" }
                                    ] as const}
                                    value={occurs}
                                    onChange={setOccurs}
                                />
                                {occurs === "repeat" ? (
                                    <>
                                        <LabelField fieldset label="Starts">
                                            <InnerButton
                                                label={Utility.formatTime(starts)}
                                                onClick={() => setOpen(open === "repeat_start" ? undefined : "repeat_start")}
                                            />
                                        </LabelField>
                                        <Collapse value="repeat_start">
                                            <TimePicker fieldset value={starts} onChange={(val) => setStarts(val)} />
                                        </Collapse>
                                        <Option
                                            fieldset
                                            label="Length"
                                            value={Utility.formatDuration(duration)}
                                        >
                                            <Slide>
                                                <DurationSelect value={duration} onChange={setDuration} />
                                            </Slide>
                                        </Option>
                                        <Option
                                            fieldset
                                            label="Frequency"
                                            value={frequencyLabelMap[frequency]}
                                        >
                                            <Slide>
                                                <SelectList
                                                    options={[
                                                        { value: "daily", label: "Daily" },
                                                        { value: "weekly", label: "Weekly" },
                                                        { value: "monthly", label: "Monthly" },
                                                        { value: "yearly", label: "Yearly" }
                                                    ]}
                                                    value={frequency}
                                                    onChange={setFrequency}
                                                />
                                            </Slide>
                                        </Option>
                                        <Option
                                            fieldset
                                            label="Every"
                                            value={getIntervalLabel(frequency, interval)}
                                        >
                                            <Slide>
                                                <MultiSelect
                                                    options={{
                                                        days: Array.from({ length: 100 }).map((_, i) => ({
                                                            value: i + 1,
                                                            label: `${i + 1}`
                                                        }))
                                                    }}
                                                    value={{ days: interval }}
                                                    onChange={(val) => setInterval(val.days)}
                                                />
                                            </Slide>
                                        </Option>
                                        {frequency === "weekly" ? (
                                            <Option
                                                fieldset
                                                label="Weekdays"
                                                value={getWeekdaysLabel(weekdays)}
                                            >
                                                <Slide>
                                                    <SelectList
                                                        multiple
                                                        options={["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((weekday, i) => ({
                                                            value: i,
                                                            label: weekday
                                                        }))}
                                                        value={weekdays}
                                                        onChange={setWeekdays}
                                                    />
                                                </Slide>
                                            </Option>
                                        ) : frequency === "monthly" ? (
                                            <>
                                                <SelectBar
                                                    fieldset
                                                    options={[
                                                        { value: "dates", label: "Each" },
                                                        { value: "weekday", label: "On The" }
                                                    ]}
                                                    value={monthlyType}
                                                    onChange={setMonthlyType}
                                                />
                                                {monthlyType === "dates" ? (
                                                    <DatePicker fieldset value={starts} onChange={setStarts} />
                                                ) : monthlyType === "weekday" ? (
                                                    <NthWeekdaySelect fieldset value={weekday} onChange={setWeekday} />
                                                ) : null}
                                            </>
                                        ) : frequency === "yearly" ? (
                                            <>
                                                <Option
                                                    fieldset
                                                    label="Months"
                                                    value={getMonthsLabel(months)}
                                                >
                                                    <Slide>
                                                        <SelectList
                                                            multiple
                                                            options={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => ({
                                                                value: i,
                                                                label: month
                                                            }))}
                                                            value={months}
                                                            onChange={setMonths}
                                                        />
                                                    </Slide>
                                                </Option>
                                                <SelectBar
                                                    fieldset
                                                    options={[
                                                        { value: "dates", label: "Each" },
                                                        { value: "weekday", label: "On The" }
                                                    ]}
                                                    value={monthlyType}
                                                    onChange={setMonthlyType}
                                                />
                                                {monthlyType === "dates" ? (
                                                    <DatePicker fieldset value={starts} onChange={setStarts} />
                                                ) : monthlyType === "weekday" ? (
                                                    <NthWeekdaySelect fieldset value={weekday} onChange={setWeekday} />
                                                ) : null}
                                            </>
                                        ) : null}
                                    </>
                                ) : occurs === "once" ? (
                                    <>
                                        <LabelField fieldset label="Starts">
                                            <InnerButton
                                                label={Utility.formatDate(starts)}
                                                onClick={() => setOpen(open === "starts_date" ? undefined : "starts_date")}
                                            />
                                            <InnerButton
                                                label={Utility.formatTime(starts)}
                                                onClick={() => setOpen(open === "starts_time" ? undefined : "starts_time")}
                                            />
                                        </LabelField>
                                        <Collapse value="starts_date">
                                            <DatePicker fieldset value={starts} onChange={(val) => setStarts(val)} />
                                        </Collapse>
                                        <Collapse value="starts_time">
                                            <TimePicker fieldset value={starts} onChange={(val) => setStarts(val)} />
                                        </Collapse>
                                        <Option
                                            fieldset
                                            label="Length"
                                            value={Utility.formatDuration(duration)}
                                        >
                                            <Slide>
                                                <DurationSelect value={duration} onChange={setDuration} />
                                            </Slide>
                                        </Option>
                                    </>
                                ) : null}
                            </Fieldset>
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