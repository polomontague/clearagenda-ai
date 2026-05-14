"use client"
import { useState } from "react"
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
import Repeat, { RepeatValue } from "../Repeat"
import TextArea from "../TextArea"

export default function EventForm() {
    const [name, setName] = useState("")
    const [occurs, setOccurs] = useState<"once" | "repeating">("once")
    const [onceStarts, setOnceStarts] = useState(new Date())
    const [duration, setDuration] = useState(60)
    const [repeat, setRepeat] = useState<RepeatValue>({
        frequency: "daily",
        interval: 1,
        starts: new Date(),
        ends: new Date()
    })
    const [notes, setNotes] = useState("")

    const handleSubmit = () => {

    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <TextInput placeholder="Name..." value={name} onChange={setName} />
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
                            <LabelField fieldset label="Starts">
                                <InnerButton
                                    label={Utility.formatDate(onceStarts)}
                                    onClick={() => {}}
                                />
                                <InnerButton
                                    label={Utility.formatTime(onceStarts)}
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
                                    label={Utility.formatTime(onceStarts)}
                                    onClick={() => {}}
                                />
                            </LabelField>
                            <Option fieldset label="Length" value={Utility.formatDuration(duration)}>
                                <Slide>
                                    <DurationSelect value={duration} onChange={setDuration} />
                                </Slide>
                            </Option>
                            <Option fieldset label="Repeat" value="egerre">
                                <Slide>
                                    <Repeat value={repeat} onChange={setRepeat} />
                                </Slide>
                            </Option>
                        </>
                    ) : null}
                </Fieldset>
                <TextArea rows={6} placeholder="Notes..." value={notes} onChange={setNotes} />
            </FieldFrame>
        </Form>
    )
}