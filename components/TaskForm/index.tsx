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
import SelectList from "../SelectList"
import ListInput from "../ListInput"
import { WarningIcon } from "../Icons"

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
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [loading, setLoading] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [clarity, setClarity] = useState(DEFAULTS.clarity)
    const [friction, setFriction] = useState<string[]>(DEFAULTS.friction)
    const [specifications, setSpecifications] = useState<string[]>(DEFAULTS.specifications)

    useEffect(() => {
        if (props.mode === "edit") {
            setDescription(props.task.description)
            setClarity(props.task.clarity)
            setFriction(props.task.friction)
            setSpecifications(props.task.specifications)
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
            clarity,
            friction,
            specifications,
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
        setClarity(DEFAULTS.clarity)
        setFriction(DEFAULTS.friction)
        setSpecifications(DEFAULTS.specifications)
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
                    description="Describe what needs to be done. The clearer the task, the more accurate the steps, timing, and importance estimates will be."
                >
                    <TextArea rows={6} fieldset placeholder="Describe the task..." value={description} onChange={setDescription} />
                </Fieldset>
                <Fieldset
                    label="Clarity"
                    description="Helps our AI decide how much structure and guidance to provide."
                >
                    <SelectList
                        fieldset
                        multiple={false}
                        options={[
                            { value: "high", label: "I know exactly how I’ll do it" },
                            { value: "medium", label: "I have a rough idea" },
                            { value: "low", label: "I’m not sure where to start" }
                        ]}
                        value={clarity}
                        onChange={setClarity}
                    />
                </Fieldset>
                {clarity === "low" || clarity === "medium" ? (
                    <Fieldset
                        label="Unclear Areas"
                        description="Calling out unknowns helps our AI identify missing steps and reduce ambiguity in the plan."
                    >
                        <SelectList
                            fieldset
                            multiple
                            value={friction}
                            options={[
                                { value: "starting", label: "How to start" },
                                { value: "steps", label: "What steps are involved" },
                                { value: "learning", label: "What I need to learn" },
                                { value: "scope", label: "What the final result should include" },
                                { value: "approach", label: "Which approach to take" },
                                { value: "duration", label: "How long it will take" }
                            ]}
                            onChange={setFriction}
                        />
                    </Fieldset>
                ) : <></>}
                <Fieldset
                    label="Specifications"
                    description="Include any requirements, preferences, or constraints. These details help our AI generate a plan that fits the actual work."
                >
                    <ListInput
                        fieldset
                        placeholder="Specification..."
                        value={specifications}
                        onChange={setSpecifications}
                    />
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
            </FieldFrame>
            <Loading loading={loading} />
            <Alert
                label="Error"
                icon={<WarningIcon />}
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
            <DoneButton disabled={doneDisabled} />
        </Form>
    )
}