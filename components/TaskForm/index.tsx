"use client"
import { useState } from "react"
import TextArea from "@/components/TextArea"
import Form from "@/components/Form"
import LabelField from "@/components/LabelField"
import FieldFrame from "@/components/FieldFrame"
import Toggle from "@/components/Toggle"
import Fieldset from "@/components/Fieldset"

export default function TaskForm() {
    const [complex, setComplex] = useState(false)
    const [task, setTask] = useState("")

    return (
        <Form>
            <FieldFrame>
                <Fieldset
                    description="Our AI will break down your complex task into bite-sized steps that won't overwhelm you."
                >
                    <LabelField fieldset label="Complex">
                        <Toggle on={complex} onChange={(val) => setComplex(val)} />
                    </LabelField>
                </Fieldset>
                <TextArea rows={6} placeholder="Describe the task..." value={task} onChange={(val) => setTask(val)} />
            </FieldFrame>
        </Form>
    )
}