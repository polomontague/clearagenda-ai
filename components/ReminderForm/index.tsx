"use client"
import Form from "../Form"
import FieldFrame from "../FieldFrame"
import TextInput from "../TextInput"
import { useState, useEffect } from "react"
import Fieldset from "../Fieldset"
import SelectBar from "../SelectBar"
import LabelField from "../LabelField"
import InnerButton from "../InnerButton"
import Utility from "@/lib/Utility"
import { Option, Slide } from "@/components/FormModal"
import Repeat from "../Repeat"
import RepeatType from "@/types/Repeat"

export default function ReminderForm() {
    const [name, setName] = useState("")
    const [occurs, setOccurs] = useState<"once" | "repeating">("once")
    const [at, setAt] = useState(Utility.roundTime(new Date()))
    const [repeat, setRepeat] = useState<RepeatType>({
        frequency: "daily",
        interval: 1,
        starts: Utility.getDateKey(new Date())
    })

    useEffect(() => {
        console.log('Repeat:', repeat)
    }, [repeat])

    const handleSubmit = () => {

    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <TextInput placeholder="Name..." value={name} onChange={setName} />
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
                            <LabelField fieldset label="At">
                                <InnerButton
                                    label={Utility.formatDate(at)}
                                    onClick={() => {}}
                                />
                                <InnerButton
                                    label={Utility.formatTime(at)}
                                    onClick={() => {}}
                                />
                            </LabelField>
                        </>
                    ) : occurs === "repeating" ? (
                        <>
                            <LabelField fieldset label="At">
                                <InnerButton
                                    label={Utility.formatTime(at)}
                                    onClick={() => {}}
                                />
                            </LabelField>
                            <Option fieldset label="Repeat" value={Utility.getShortRepeatLabel(repeat)}>
                                <Slide>
                                    <Repeat value={repeat} onChange={setRepeat} />
                                </Slide>
                            </Option>
                        </>
                    ) : null}
                </Fieldset>
            </FieldFrame>
        </Form>
    )
}