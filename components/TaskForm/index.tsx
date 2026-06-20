"use client"
import Form from "../Form"
import Fieldset from "../Fieldset"
import TextArea from "../TextArea"
import FieldFrame from "../FieldFrame"
import { useEffect, useState } from "react"
import SelectBar from "../SelectBar"
import SlideField from "../SlideField"
import RepeatPicker from "../RepeatPicker"
import Utility from "@/lib/Utility"
import DatePicker from "../DatePicker"
import RepeatType from "@/types/Repeat"
import DEFAULTS from "./DEFAULTS"
import Loading from "../Loading"
import Alert from "../Alert"
import API from "@/lib/API"
import { DoneButton } from "@/components/FormModal"
import Task from "@/types/Task"
import MultiSelect from "../MultiSelect"
import RangeInput from "../RangeInput"

type BaseProps = {
    onSuccess: (task: Task) => void
}

type NewProps = BaseProps & {
    mode: "new"
}

type EditProps = BaseProps & {
    mode: "edit",
    task: Task
}

type TaskFormProps = NewProps | EditProps

export default function TaskForm(props: TaskFormProps) {
    const [description, setDescription] = useState(DEFAULTS.description)
    const [experience, setExperience] = useState(DEFAULTS.experience)
    const [occurs, setOccurs] = useState<"once" | "repeating">(DEFAULTS.occurs)
    const [hasDeadline, setHasDeadline] = useState(DEFAULTS.hasDeadline)
    const [onceDeadline, setOnceDeadline] = useState(DEFAULTS.onceDeadline)
    const [repeatingDeadline, setRepeatingDeadline] = useState(DEFAULTS.repeatingDeadline)
    const [repeat, setRepeat] = useState<RepeatType>(DEFAULTS.repeat)
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const experienceLabels = [ "First time doing this", "I've done something similar before", "I've done this many times" ]

    useEffect(() => {
        if (props.mode === "edit") {
            setDescription(props.task.description)
            setExperience(props.task.experience)
            setOccurs(props.task.occurs)
            setHasDeadline(Boolean(props.task.deadline))
            if (props.task.occurs === "once" && props.task.deadline) setOnceDeadline(Utility.loadLocalDate(props.task.deadline))
            if (props.task.occurs === "repeating" && props.task.deadline) setRepeatingDeadline(props.task.deadline)
            if ("repeat" in props.task) setRepeat(props.task.repeat)
        }
    }, [props.mode === "edit" ? props.task : null])

    useEffect(() => {
        setDoneDisabled(!validate(description))
    }, [description])

    const validate = (description: string): boolean => {
        if (!description) return false
        return true
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.mode === "new" ? "post" : "put"
        const body = {
            occurs,
            description,
            experience,
            deadline: hasDeadline ? (occurs === "once" ? Utility.getDateKey(onceDeadline) : repeatingDeadline) : undefined,
            repeat: occurs === "repeating" ? repeat : undefined
        }
        API[method]<{ task: Task }>("/api/v1/tasks", body, true).then(data => {
            setLoading(false)
            if (props.mode === "new") clear()
            props.onSuccess(data.task)
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    const clear = () => {
        setDescription(DEFAULTS.description)
        setExperience(0)
        setOccurs(DEFAULTS.occurs)
        setHasDeadline(DEFAULTS.hasDeadline)
        setOnceDeadline(DEFAULTS.onceDeadline)
        setRepeatingDeadline(DEFAULTS.repeatingDeadline)
        setRepeat(DEFAULTS.repeat)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset
                    description="Our AI breaks down tasks into actionable steps, and estimates importance and duration."
                >
                    <TextArea rows={8} fieldset placeholder="Describe the task..." value={description} onChange={setDescription} />
                </Fieldset>
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
                        <SlideField
                            fieldset
                            label="Deadline"
                            value={hasDeadline ? Utility.formatDate(onceDeadline) : "None"}
                        >
                            <Fieldset>
                                <SelectBar
                                    fieldset
                                    options={[
                                        { value: false, label: "None" },
                                        { value: true, label: "Date" }
                                    ]}
                                    value={hasDeadline}
                                    onChange={setHasDeadline}
                                />
                                {hasDeadline ? (
                                    <DatePicker fieldset value={onceDeadline} onChange={setOnceDeadline} />
                                ) : null}
                            </Fieldset>
                        </SlideField>
                    ) : occurs === "repeating" ? (
                        <>
                            <SlideField
                                fieldset
                                label="Deadline"
                                value={hasDeadline ? `${repeatingDeadline} ${repeatingDeadline === 1 ? "Day" : "Days"}` : "None"}
                            >
                                <Fieldset>
                                    <SelectBar
                                        fieldset
                                        options={[
                                            { value: false, label: "None" },
                                            { value: true, label: "Days" }
                                        ] as const}
                                        value={hasDeadline}
                                        onChange={setHasDeadline}
                                    />
                                    {hasDeadline ? (
                                        <MultiSelect
                                            fieldset
                                            options={{
                                                days: Array.from({ length: 100 }).map((_, i) => ({
                                                    value: i + 1,
                                                    label: i === 0 ? "Same Day" : `${i + 1} ${i === 0 ? "Day" : "Days"}`
                                                }))
                                            }}
                                            value={{ days: repeatingDeadline }}
                                            onChange={(val) => setRepeatingDeadline(val.days)}
                                        />
                                    ) : null}
                                </Fieldset>
                            </SlideField>
                            <SlideField
                                fieldset
                                label="Repeat"
                                value={Utility.getShortRepeatLabel(repeat)}
                            >
                                <RepeatPicker value={repeat} onChange={setRepeat} />
                            </SlideField>
                        </>
                    ) : null}
                </Fieldset>
                <Fieldset
                    label="Experience"
                    description={experienceLabels[experience]}
                >
                    <RangeInput fieldset min={0} max={2} step={1} value={experience} onChange={setExperience} />
                </Fieldset>
            </FieldFrame>
            <Loading loading={loading} />
            <Alert message={alertMessage} open={alertOpen} onRequestClose={() => setAlertOpen(false)} />
            <DoneButton disabled={doneDisabled} />
        </Form>
    )
}