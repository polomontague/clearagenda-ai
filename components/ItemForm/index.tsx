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

    useEffect(() => {
        if (props.type === "edit") {
            setDescription(props.item.description)
            setHasDeadline(!!props.item.deadline)
            setDeadline(props.item.deadline ? new Date(props.item.deadline) : new Date())
        }
    }, [ props.type === "edit" ? props.item : null ])

    useEffect(() => {
        setDoneDisabled(!validate())
    }, [description])

    const validate = () => {
        let valid = true
        if (!description) valid = false
        return valid
    }

    const handleSubmit = () => {
        setLoading(true)
        const method = props.type === "new" ? "post" : "put"
        const endpoint = `/api/v1/items${props.type === "edit" ? `/${props.item.id}` : ""}`
        const body = {
            description,
            deadline: hasDeadline ? deadline.toISOString() : undefined
        }
        API[method]<{ item: Item }>(endpoint, body, true).then(data => {
            setLoading(false)
            if (props.type === "new") {
                setDescription("")
                setDeadline(new Date())
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
            <FieldFrame>
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
                                <InnerValue label={Utility.formatDate(deadline)} />
                            </LabelField>
                            <DatePicker fieldset value={deadline} onChange={(val) => setDeadline(val)} />
                        </>
                    ) : null}
                </Fieldset>
            </FieldFrame>
            <Alert open={alertOpen} message={alertMessage} onRequestClose={() => setAlertOpen(false)} />
            <DoneButton disabled={doneDisabled || loading} />
            <Loading loading={loading} />
        </Form>
    )
}