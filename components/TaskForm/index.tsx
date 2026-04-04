"use client"
import { useState, useEffect } from "react"
import TextArea from "@/components/TextArea"
import Form from "@/components/Form"
import LabelField from "@/components/LabelField"
import FieldFrame from "@/components/FieldFrame"
import Toggle from "@/components/Toggle"
import Fieldset from "@/components/Fieldset"
import TextInput from "@/components/TextInput"
import { DoneButton } from "@/components/Modal"
import axios from "axios"
import Alert from "@/components/Alert"
import Task from "@/types/Task"

type BaseProps = {
    onSuccess: (task: Task) => void
}

type NewProps = BaseProps & {
    type: "new"
}

type EditProps = BaseProps & {
    type: "edit",
    task: Task
}

type TaskFormProps = NewProps | EditProps

export default function TaskForm(props: TaskFormProps) {
    const [complex, setComplex] = useState(false)
    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [notes, setNotes] = useState("")
    const [doneDisabled, setDoneDisabled] = useState(true)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)

    useEffect(() => {
        if (props.type === "edit") {
            if (props.task.type ==="simple") {
                setComplex(false)
                setName(props.task.name)
                setNotes(props.task.notes ?? "")
                setDescription("")
            }
            if (props.task.type === "complex") {
                setComplex(true)
                setName(props.task.name)
                setNotes("")
                setDescription(props.task.description)
            }
        }
    }, [ props.type === "edit" ? props.task : null ])

    useEffect(() => {
        setDoneDisabled(!validate())
    }, [complex, description, name, notes])

    const validate = () => {
        let valid = true
        if (complex) {
            // Complex Task
            if (!description) valid = false
        } else {
            // Simple Task
            if (!name) valid = false
        }
        return valid
    }

    const handleSubmit = () => {
        const method = props.type === "new" ? "post" : "put"
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tasks${props.type === "edit" ? `/${props.task.id}` : ""}`
        const body = complex ? {
            name,
            description
        } : {
            name,
            notes: notes ? notes : undefined
        }
        axios[method](url, body).then(res => {
            if (props.type === "new") {
                setComplex(false)
                setName("")
                setNotes("")
                setDescription("")
            }
            props.onSuccess(res.data.data.task)
        }).catch(err => {
            setAlertMessage(err.response.data.error.message)
            setAlertOpen(true)
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset
                    description="Our AI will break down your complex task into bite-sized steps that won't overwhelm you."
                >
                    <LabelField fieldset label="Complex">
                        <Toggle on={complex} onChange={(val) => setComplex(val)} />
                    </LabelField>
                </Fieldset>
                {complex ? (
                    <>
                        <TextInput placeholder="Name..." value={name} onChange={(val) => setName(val)} />
                        <TextArea rows={6} placeholder="Describe the task..." value={description} onChange={(val) => setDescription(val)} />
                    </>
                ) : (
                    <>
                        <TextInput placeholder="Name..." value={name} onChange={(val) => setName(val)} />
                        <TextArea rows={6} placeholder="Notes..." value={notes} onChange={(val) => setNotes(val)} />
                    </>
                )}
            </FieldFrame>
            <Alert open={alertOpen} message={alertMessage} onRequestClose={() => setAlertOpen(false)} />
            <DoneButton disabled={doneDisabled} />
        </Form>
    )
}