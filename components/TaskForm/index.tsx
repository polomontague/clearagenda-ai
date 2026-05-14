"use client"
import Form from "../Form"
import Fieldset from "../Fieldset"
import TextArea from "../TextArea"
import FieldFrame from "../FieldFrame"
import { useState } from "react"
import SelectBar from "../SelectBar"
import { Option, Slide } from "@/components/FormModal"
import Repeat, { RepeatValue } from "../Repeat"
import LabelField from "../LabelField"
import Collapses, { Collapse } from "../Collapses"
import Utility from "@/lib/Utility"
import DatePicker from "../DatePicker"
import Toggle from "../Toggle"
import InnerButton from "../InnerButton"

export default function TaskForm() {
    const [description, setDescription] = useState("")
    const [occurs, setOccurs] = useState<"once" | "repeating">("once")
    const [hasDeadline, setHasDeadline] = useState(false)
    const [onceDeadline, setOnceDeadline] = useState(new Date())
    const [repeatingDeadline, setRepeatingDeadline] = useState(1)
    const [repeat, setRepeat] = useState<RepeatValue>({
        frequency: "daily",
        interval: 1,
        starts: new Date(),
        ends: new Date()
    })
    const [open, setOpen] = useState<"deadline" | undefined>(undefined)

    const handleSubmit = () => {

    }

    const formatDays = (days: number) => {
        return `${days} ${days === 1 ? "Day" : "Days"}`
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
                    <Fieldset>
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
                                <InnerButton
                                    label={formatDays(repeatingDeadline)}
                                    onClick={() => setOpen(open === "deadline" ? undefined : "deadline")}
                                />
                            </LabelField>
                                <Option 
                                    fieldset
                                    value="repeat"
                                    label="Repeat"
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
        </Form>
    )
}