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
import { useCookies } from "react-cookie"
import API from "@/lib/API"
import Alert from "@/components/Alert"
import axios from "axios"

type AgendaProps = {
    day: "today" | "tomorrow"
}

export default function Agenda(props: AgendaProps) {
    const [agenda, setAgenda] = useState<AgendaType | undefined>()
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [currentItem, setCurrentItem] = useState<AgendaItem | undefined>()
    const [cookies] = useCookies()
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)

    useEffect(() => {
        getAgenda(props.day)
    }, [props.day])

    const getAgenda = (day: "today" | "tomorrow") => {
        const date = new Date()
        if (day === "tomorrow") date.setDate(date.getDate() + 1)
        const dateString = date.toISOString().slice(0, 10)
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agenda?date=${dateString}`, {
            headers: {
                Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
            }
        }).then(res => {
            const agenda = res.data.data.agenda
            setAgenda(agenda)
        })
    }

    const getDeadlineStatus = (date: Date) => {
        const today = new Date()
        if (date.getTime() < today.getTime()) return "Past Due!"
        return "On Time"
    }

    const handleCompleteClick = (item: AgendaItem) => {
        setCurrentItem(item)
        const name = item.type === "task" && item.task.type === "simple" ? item.task.name
            : item.type === "task" && item.task.type === "complex" ? item.task.step.name
            : ""
        setConfirmMessage(`Mark "${name}" as Complete?`)
        setConfirmOpen(true)
    }

    const handleCompleteConfirm = () => {
        setConfirmOpen(false)
        if (currentItem?.type === "task") {
            let url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tasks/${currentItem.task.id}`
            if (currentItem.task.type === "complex") url += `/steps/${currentItem.task.step.id}`
            url += "/complete"
            API.post<{ completed: string }>(url, {}, true).then(data => {
                const newAgenda = { ...agenda! }
                newAgenda.items.forEach(item => {
                    if (item.type === "task") {
                        if (item.task.type === "simple") {
                            if (item.task.id === currentItem.task.id) {
                                item.task.completed = data.completed
                            }
                        }
                        if (item.task.type === "complex") {
                            //if (item.task.step.id === currentItem.task.)
                        }
                    }
                })
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
                            {item.type === "task" && item.task.type === "simple" ? (
                                <Card
                                    label={item.task.name}
                                    locked={locked}
                                    completed={!!item.task.completed}
                                >
                                    <FieldFrame>
                                        {item.task.notes ? (
                                            <Fieldset label="Notes">
                                                <ValueBox fieldset value={item.task.notes} />
                                            </Fieldset>
                                        ) : <></>}
                                        <LabelField label="Duration">
                                            <InnerValue label={Utility.formatTime(item.task.duration)} />
                                        </LabelField>
                                        {item.task.deadline ? (
                                            <LabelField label="Deadline">
                                                <InnerValue label={getDeadlineStatus(new Date(item.task.deadline))} />
                                            </LabelField>
                                        ) : <></>}
                                        <Button
                                            label="Mark Complete"
                                            onClick={() => handleCompleteClick(item)}
                                        />
                                    </FieldFrame>
                                </Card>
                            ) : item.type === "task" && item.task.type === "complex" ? (
                                <Fieldset layer={2} label={item.task.name}>
                                    <Card
                                        fieldset
                                        label={item.task.step.name}
                                        locked={locked}
                                        completed={!!item.task.step.completed}
                                    >
                                        <FieldFrame>
                                            <Fieldset label="Notes">
                                                <ValueBox fieldset value={item.task.step.notes} />
                                            </Fieldset>
                                            <LabelField label="Duration">
                                                <InnerValue label={Utility.formatTime(item.task.step.duration)} />
                                            </LabelField>
                                            {item.task.deadline ? (
                                                <LabelField label="Deadline">
                                                    <InnerValue label={getDeadlineStatus(new Date(item.task.deadline))} />
                                                </LabelField>
                                            ) : <></>}
                                            <Button
                                                label="Mark Complete"
                                                onClick={() => handleCompleteClick(item)}
                                            />
                                        </FieldFrame>
                                    </Card>
                                </Fieldset>
                            ) : null}
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