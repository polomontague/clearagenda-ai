"use client"
import Form from "../Form"
import Fieldset from "../Fieldset"
import TextArea from "../TextArea"
import FieldFrame from "../FieldFrame"
import { useEffect, useState } from "react"
import SelectBar from "../SelectBar"
import { Option, Slide } from "@/components/FormModal"
import Repeat from "../Repeat"
import LabelField from "../LabelField"
import Collapses, { Collapse } from "../Collapses"
import Utility from "@/lib/Utility"
import DatePicker from "../DatePicker"
import Toggle from "../Toggle"
import InnerButton from "../InnerButton"
import RepeatType from "@/types/Repeat"
import DEFAULTS from "./DEFAULTS"
import Loading from "../Loading"
import Alert from "../Alert"
import API from "@/lib/API"
import { DoneButton } from "@/components/FormModal"
import Task from "@/types/Task"

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
    const [occurs, setOccurs] = useState<"once" | "repeating">(DEFAULTS.occurs)
    const [hasDeadline, setHasDeadline] = useState(DEFAULTS.hasDeadline)
    const [onceDeadline, setOnceDeadline] = useState(DEFAULTS.onceDeadline)
    const [repeatingDeadline, setRepeatingDeadline] = useState(DEFAULTS.repeatingDeadline)
    const [repeat, setRepeat] = useState<RepeatType>(DEFAULTS.repeat)
    const [open, setOpen] = useState<"deadline" | undefined>(undefined)
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)

    useEffect(() => {
        setDoneDisabled(!validate(description))
    }, [description])

    const validate = (description: string): boolean => {
        if (!description) return false
        return true
    }

    const formatDays = (days: number) => {
        return `${days} ${days === 1 ? "Day" : "Days"}`
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.mode === "new" ? "post" : "put"
        const body = {
            occurs,
            description,
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
        setOccurs(DEFAULTS.occurs)
        setHasDeadline(DEFAULTS.hasDeadline)
        setOnceDeadline(DEFAULTS.onceDeadline)
        setRepeatingDeadline(DEFAULTS.repeatingDeadline)
        setRepeat(DEFAULTS.repeat)
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Collapses value={open}>
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
                            <>
                                <LabelField fieldset label="Deadline">
                                    <Toggle on={hasDeadline} onChange={setHasDeadline} />
                                </LabelField>
                                {hasDeadline ? (
                                    <>
                                        <LabelField fieldset label="Date">
                                            <InnerButton
                                                label={Utility.formatDate(onceDeadline)}
                                                onClick={() => setOpen(open === "deadline" ? undefined : "deadline")}
                                            />
                                        </LabelField>
                                        <Collapse value="deadline">
                                            <DatePicker fieldset value={onceDeadline} onChange={setOnceDeadline} />
                                        </Collapse>
                                    </>
                                ) : null}
                            </>
                        ) : occurs === "repeating" ? (
                            <>
                                <LabelField fieldset label="Deadline">
                                    <Toggle on={hasDeadline} onChange={setHasDeadline}/>
                                </LabelField>
                                {hasDeadline ? (
                                    <LabelField fieldset label="Days Out">
                                        <InnerButton
                                            label={formatDays(repeatingDeadline)}
                                            onClick={() => setOpen(open === "deadline" ? undefined : "deadline")}
                                        />
                                    </LabelField>
                                ) : null}
                                <Option 
                                    fieldset
                                    label="Repeat"
                                    value={Utility.getShortRepeatLabel(repeat)}
                                >
                                    <Slide>
                                        <Repeat value={repeat} onChange={setRepeat} />
                                    </Slide>
                                </Option>
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