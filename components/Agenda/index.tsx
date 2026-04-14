"use client"
import { useEffect, useState } from "react"
import AgendaType, { AgendaItem } from "@/types/Agenda"
import Card from "@/components/Card"
import FieldFrame from "@/components/FieldFrame"
import LabelField from "@/components/LabelField"
import Fieldset from "@/components/Fieldset"
import List, { ListItem } from "@/components/List"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"
import ValueBox from "@/components/ValueBox"
import Button from "@/components/Button"
import Confirm from "@/components/Confirm"
import API from "@/lib/API"
import Alert from "@/components/Alert"
import { Step } from "@/types/Item"

type AgendaProps = {
    day: "today" | "tomorrow"
}

export default function Agenda(props: AgendaProps) {
    const [agenda, setAgenda] = useState<AgendaType | undefined>()
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [currentItem, setCurrentItem] = useState<AgendaItem | undefined>()
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)

    useEffect(() => {
        getAgenda(props.day)
    }, [props.day])

    const getAgenda = (day: "today" | "tomorrow") => {
        const date = new Date()
        if (day === "tomorrow") date.setDate(date.getDate() + 1)
        const dateString = date.toISOString().slice(0, 10)
        API.get<{ agenda: AgendaType }>(`/api/v1/agenda?date=${dateString}`, true).then(data => {
            setAgenda(data.agenda)
        })
    }

    const getDeadlineStatus = (date: Date) => {
        const today = new Date()
        if (date.getTime() < today.getTime()) return "Past Due!"
        return "On Time"
    }

    const handleCompleteClick = (item: AgendaItem) => {
        setCurrentItem(item)
        setConfirmMessage(`Mark "${item.step.name}" as Complete?`)
        setConfirmOpen(true)
    }

    const handleCompleteConfirm = () => {
        if (currentItem) {
            setConfirmOpen(false)
            const url = `/api/v1/items/${currentItem.id}/steps/${currentItem.step.id}`
            API.post<{ completed: string }>(url, {}, true).then(data => {
                const newAgenda = { ...agenda! }
                const foundItem = newAgenda.items.find(item => item.id === currentItem.id && item.step.id === currentItem.step.id)
                if (foundItem) foundItem.step.completed = data.completed
                setAgenda(newAgenda)
            }).catch(err => {
                setAlertMessage(err.message)
                setAlertOpen(true)
            })
        }
    }

    return agenda ? (
        <>
            <List>
                {agenda.items.map((item, i) => {
                    const locked = false //i >= 2
                    return (
                        <ListItem key={i}>
                            <Fieldset layer={2} label={item.name}>
                                <Card
                                    fieldset
                                    label={item.step.name}
                                    locked={locked}
                                    completed={!!item.step.completed}
                                >
                                    <FieldFrame>
                                        <Fieldset label="Notes">
                                            <ValueBox fieldset value={item.step.notes} />
                                        </Fieldset>
                                        <LabelField label="Duration">
                                            <InnerValue label={Utility.formatTime(item.step.duration)} />
                                        </LabelField>
                                        {item.deadline ? (
                                            <LabelField label="Deadline">
                                                <InnerValue label={getDeadlineStatus(new Date(item.deadline))} />
                                            </LabelField>
                                        ) : <></>}
                                        <Button
                                            label="Mark Complete"
                                            onClick={() => handleCompleteClick(item)}
                                        />
                                    </FieldFrame>
                                </Card>
                            </Fieldset>
                        </ListItem>
                    )
                })}
            </List>
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
    ) : null
}