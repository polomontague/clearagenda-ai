"use client"
import { useState, useContext, useEffect, useMemo } from "react"
import Card from "@/components/Card"
import FieldFrame from "@/components/FieldFrame"
import LabelField from "@/components/LabelField"
import Fieldset from "@/components/Fieldset"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"
import ValueBox from "@/components/ValueBox"
import Button from "@/components/Button"
import Confirm from "@/components/Confirm"
import API from "@/lib/API"
import Alert from "@/components/Alert"
import ItemsContext from "@/contexts/ItemsContext"
import UserContext from "@/contexts/UserContext"
import Columns from "@/components/Columns"
import getCurrent from "./getCurrent"
import Range from "@/components/Range"
import getDateItems, { CompletionItem } from "./getDateItems(2)"

type AgendaProps = {
    date: Date
}

export default function Agenda(props: AgendaProps) {
    const { items } = useContext(ItemsContext)
    const [agendaItems, setAgendaItems] = useState<CompletionItem[]>([])
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const { user } = useContext(UserContext)
    const current = useMemo(() => getCurrent(agendaItems), [agendaItems])
    const today = props.date.toLocaleDateString("en-CA") === new Date().toLocaleDateString("en-CA")

    useEffect(() => {
        if (items.length && user) {
            const newAgendaItems = getDateItems(items, props.date, user.preferences.hours)
            setAgendaItems(newAgendaItems)
        }
    }, [items, user, props.date])

    const getDeadlineStatus = (deadline: Date) => {
        const today = new Date()
        if (deadline.getTime() < today.getTime()) return "past_due"
        return "on_time"
    }

    const handleCompleteClick = () => {
        setConfirmMessage(`Mark "${current?.step.name}" as Complete?`)
        setConfirmOpen(true)
    }

    const handleCompleteConfirm = () => {
        setConfirmOpen(false)
        if (!current) return
        const url = `/api/v1/items/${current.item.id}/steps/${current.step.id}/complete`
        API.post<{ completed: string }>(url, {}, true).then(data => {
            const newAgendaItems = [ ...agendaItems ]
            const foundItem = newAgendaItems.find(item => item.id === current.item.id)
            const foundStep = foundItem && foundItem.type === "task" ? foundItem.steps.find(step => step.id === current.step.id) : undefined
            if (foundStep) foundStep.completed = data.completed
            setAgendaItems(newAgendaItems)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    return(
        <>
            <Columns
                left={(
                    <FieldFrame>
                        {agendaItems.map((item, i) => {
                            const isCurrent = item.id === current?.item.id
                            return (
                                <Card key={i} label={item.name}>
                                    {item.type === "task" ? (
                                        <FieldFrame>
                                            <Fieldset label="Steps">
                                                {item.steps.map((step, i) => {
                                                    return (
                                                        <LabelField
                                                            key={i}
                                                            fieldset
                                                            strike={!!step.completed}
                                                            label={step.name}
                                                        />
                                                    )
                                                })}
                                            </Fieldset>
                                            {today && isCurrent ? (
                                                <Fieldset>
                                                    <LabelField fieldset label="Completion">
                                                        <InnerValue label={`${Math.round(item.completion * 100)}%`} />
                                                    </LabelField>
                                                    <Range
                                                        fieldset
                                                        value={item.completion}
                                                    />
                                                </Fieldset>
                                            ) : <></>}
                                        </FieldFrame>
                                    ) : item.type === "event" ? (
                                        <FieldFrame>
                                            <LabelField label="From">
                                                <InnerValue label={Utility.formatEventFrom(item)} />
                                            </LabelField>
                                            <Button label="See Details" />
                                        </FieldFrame>
                                    ) : <></>}
                                </Card>
                            )
                        })}
                    </FieldFrame>
                )}
                right={today ? <>
                    {current ? (
                        <Fieldset layer={2} label={current.item.name}>
                            <Card fieldset label={current.step.name}>
                                <FieldFrame>
                                    <Fieldset label="Notes">
                                        <ValueBox fieldset value={current.step.notes} />
                                    </Fieldset>
                                    <LabelField label="Length">
                                        <InnerValue label={Utility.formatDuration(current.step.duration)} />
                                    </LabelField>
                                    {current.item.deadline ? (
                                        <LabelField label="Deadline">
                                            <InnerValue
                                                label={getDeadlineStatus(new Date(current.item.deadline)) === "on_time" ? "On Time" : "Past Due"}
                                                color={getDeadlineStatus(new Date(current.item.deadline)) === "on_time" ? "var(--green)" : "var(--red)"}
                                            />
                                        </LabelField>
                                    ) : <></>}
                                    <Button
                                        label="Mark Complete"
                                        onClick={() => handleCompleteClick()}
                                    />
                                </FieldFrame>
                            </Card>
                        </Fieldset>
                    ) : <></>}
                </> : <></>}
            />
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
            <Confirm
                message={confirmMessage}
                open={confirmOpen}
                onRequestCancel={() => setConfirmOpen(false)}
                onRequestConfirm={handleCompleteConfirm}
            />
        </>
    )
}