"use client"
import Form from "@/components/Form"
import Item, { Event, Ordinal, Repeat } from "@/types/Item"
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
import API from "@/lib/API"
import Loading from "@/components/Loading"
import SelectBar from "@/components/SelectBar"
import TimePicker from "@/components/TimePicker"
import NthWeekdaySelect from "@/components/NthWeekdaySelect"
import Collapses, { Collapse } from "@/components/Collapses"
import InnerButton from "@/components/InnerButton"
import SelectList from "@/components/SelectList"
import TextInput from "@/components/TextInput"
import { Option, Slide } from "@/components/FormModal"
import DurationSelect from "@/components/DurationSelect"
import MultiSelect from "@/components/MultiSelect"
import DaySelect from "@/components/DaySelect"

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
    const DEFAULTS = {
        type: "task" as const,
        description: "",
        has_deadline: false,
        deadline: new Date(),
        name: "",
        starts: roundMinutes(new Date()),
        duration: 15,
        occurs: "once" as const,
        frequency: "daily" as const,
        interval: 1,
        ordinal: 1 as const,
        weekday: new Date().getDay(),
        weekdays: [ new Date().getDay() ],
        monthly_type: "days" as const,
        days: [ new Date().getDate() ],
        yearly_type: "day" as const,
        months: [ new Date().getMonth() ],
        day: new Date().getDate(),
        repeat_start: new Date(),
        notes: ""
    }
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
    const [ordinal, setOrdinal] = useState<Ordinal>(DEFAULTS.ordinal)
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
    const frequencyLabelMap: Record<string, string> = {
        daily: "Daily",
        weekly: "Weekly",
        monthly: "Monthly",
        yearly: "Yearly"
    }

    useEffect(() => {
        if (props.type === "edit") populate(props.item)
    }, [ props.type === "edit" ? props.item : null ])

    useEffect(() => {
        setDoneDisabled(!validate())
    }, [description, name])

    function roundMinutes(date: Date) {
        const milliseconds = 5 * 60 * 1000 // 5 minutes in milliseconds
        return new Date(Math.round(date.getTime() / milliseconds) * milliseconds)
    }

    const populate = (item: Item) => {
        clear()
        setType(item.type)
        if (item.type === "task") {
            setDescription(item.description)
            if ("deadline" in item) setHasDeadline(!!item.deadline)
            if ("deadline" in item) setDeadline(item.deadline ? new Date(item.deadline) : new Date())
        } else {
            setName(item.name)
            setStarts(new Date(item.starts))
            setDuration(item.duration)
            setOccurs(("repeat" in item && item.repeat) ? "repeating" : "once")
            if ("repeat" in item && item.repeat) {
                setFrequency(item.repeat.frequency)
                setInterval(item.repeat.interval)
                if ("repeat" in item && "ordinal" in item.repeat) setOrdinal(item.repeat.ordinal)
                if ("repeat" in item && "weekday" in item.repeat) setWeekday(item.repeat.weekday)
                if ("repeat" in item && "weekdays" in item.repeat) setWeekdays(item.repeat.weekdays)
                if ("repeat" in item && item.repeat.frequency === "monthly") setMonthlyType(item.repeat.type)
                if ("repeat" in item && "months" in item.repeat) setMonths(item.repeat.months)
                if ("repeat" in item && item.repeat.frequency === "yearly") setYearlyType(item.repeat.type)
                if (item.notes) setNotes(item.notes)
            }
        }
    }

    const clear = () => {
        setType(DEFAULTS.type)
        setDescription(DEFAULTS.description)
        setHasDeadline(DEFAULTS.has_deadline)
        setDeadline(DEFAULTS.deadline)
        setName(DEFAULTS.name)
        setStarts(DEFAULTS.starts)
        setDuration(DEFAULTS.duration)
        setOccurs(DEFAULTS.occurs)
        setFrequency(DEFAULTS.frequency)
        setInterval(DEFAULTS.interval)
        setOrdinal(DEFAULTS.ordinal)
        setWeekday(DEFAULTS.weekday)
        setWeekdays(DEFAULTS.weekdays)
        setMonthlyType(DEFAULTS.monthly_type)
        setMonths(DEFAULTS.months)
        setYearlyType(DEFAULTS.yearly_type)
        setRepeatStart(DEFAULTS.repeat_start)
        setNotes(DEFAULTS.notes)
    }

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
        return `${weekdays.slice(0, SHOW).map(weekday => names[weekday]).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}`
    }

    const getMonthsLabel = (months: number[]) => {
        const SHOW = 3
        const names = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
        if (months.length === 12) return "Every Month"
        const remaining = months.length - SHOW
        return `${months.slice(0, SHOW).map(month => names[month]).join(", ")}${remaining > 0 ? ` +${remaining}` : ""}`
    }

    const validate = () => {
        if (type === "task") {
            if (!description) return false
        }
        if (type === "event") {
            if (!name) return false
        }
        return true
    }

    const getRepeat = () => {
        const repeat: Repeat = (
            frequency === "daily" ? {
                starts: repeatStart.toISOString(),
                frequency,
                interval
            } : frequency === "weekly" ? {
                starts: repeatStart.toISOString(),
                frequency,
                interval,
                weekdays
            } : frequency === "monthly" ? (
                monthlyType === "days" ? {
                    type: monthlyType,
                    starts: repeatStart.toISOString(),
                    frequency,
                    interval,
                    days
                } : { // weekday
                    type: monthlyType,
                    starts: repeatStart.toISOString(),
                    frequency,
                    interval,
                    ordinal,
                    weekday
                }
            ) : ( // yearly
                yearlyType === "day" ? {
                    type: yearlyType,
                    starts: repeatStart.toISOString(),
                    frequency,
                    interval,
                    months,
                    day
                } : { // weekday
                    type: yearlyType,
                    starts: repeatStart.toISOString(),
                    frequency,
                    interval,
                    months,
                    ordinal,
                    weekday
                }
            )
        )
        return repeat
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.type === "new" ? "post" : "put"
        const endpoint = `/api/v1/items${props.type === "edit" ? `/${props.item.id}` : ""}`
        const repeat = getRepeat()
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
            if (props.type === "new") clear()
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
                            <Fieldset
                                description={Utility.getRepeatLabel(getRepeat())}
                            >
                                <SelectBar
                                    fieldset
                                    options={[
                                        { value: "once", label: "One Time" },
                                        { value: "repeating", label: "Repeating" }
                                    ] as const}
                                    value={occurs}
                                    onChange={setOccurs}
                                />
                                {occurs === "repeating" ? (
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
                                                        onChange={(val) => setWeekdays(val)}
                                                    />
                                                </Slide>
                                            </Option>
                                        ) : frequency === "monthly" ? (
                                            <>
                                                <SelectBar
                                                    fieldset
                                                    options={[
                                                        { value: "days", label: "Each" },
                                                        { value: "weekday", label: "On The" }
                                                    ] as const}
                                                    value={monthlyType}
                                                    onChange={setMonthlyType}
                                                />
                                                {monthlyType === "days" ? (
                                                    <DaySelect fieldset multiple value={days} onChange={setDays} />
                                                ) : monthlyType === "weekday" ? (
                                                    <NthWeekdaySelect
                                                        fieldset
                                                        value={{ ordinal, weekday }}
                                                        onChange={({ ordinal, weekday }) => {
                                                            setOrdinal(ordinal)
                                                            setWeekday(weekday)
                                                        }}
                                                    />
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
                                                            onChange={(val) => setMonths(val)}
                                                        />
                                                    </Slide>
                                                </Option>
                                                <SelectBar
                                                    fieldset
                                                    options={[
                                                        { value: "day", label: "Each" },
                                                        { value: "weekday", label: "On The" }
                                                    ] as const}
                                                    value={yearlyType}
                                                    onChange={setYearlyType}
                                                />
                                                {yearlyType === "day" ? (
                                                    <DaySelect fieldset value={day} onChange={setDay} />
                                                ) : yearlyType === "weekday" ? (
                                                    <NthWeekdaySelect
                                                        fieldset
                                                        value={{ ordinal, weekday }}
                                                        onChange={({ ordinal, weekday }) => {
                                                            setOrdinal(ordinal)
                                                            setWeekday(weekday)
                                                        }}
                                                    />
                                                ) : null}
                                            </>
                                        ) : null}
                                        <LabelField fieldset label="Begin">
                                            <InnerButton
                                                label={Utility.formatDate(repeatStart)}
                                                onClick={() => setOpen(open === "start_repeating" ? undefined : "start_repeating")}
                                            />
                                        </LabelField>
                                        <Collapse value="start_repeating">
                                            <DatePicker fieldset value={repeatStart} onChange={setRepeatStart} />
                                        </Collapse>
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