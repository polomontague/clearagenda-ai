"use client"
import { useState, useContext, useEffect } from "react"
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
import ItemsContext from "@/contexts/ItemsContext"
import UserContext from "@/contexts/UserContext"
import AgendaObject from "@/lib/Agenda"

type AgendaProps = {
    date: Date
}

export default function Agenda(props: AgendaProps) {
    const { items } = useContext(ItemsContext)
    const [agenda, setAgenda] = useState<AgendaType | undefined>()
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [currentItem, setCurrentItem] = useState<AgendaItem | undefined>()
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const { user } = useContext(UserContext)

    useEffect(() => {
        if (items.length && user) {
            const newAgenda = AgendaObject.createAgenda(items, props.date, user.preferences.hours)
            setAgenda(newAgenda)
        }
    }, [items, user, props.date])

    const handleCompleteClick = (item: AgendaItem) => {
        setCurrentItem(item)
        setConfirmMessage(`Mark "${item.step.name}" as Complete?`)
        setConfirmOpen(true)
    }

    const handleCompleteConfirm = () => {
        if (currentItem) {
            setConfirmOpen(false)
            const url = `/api/v1/items/${currentItem.id}/steps/${currentItem.step.id}/complete`
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

    if (!agenda) return

    return(
        <>
            <List>
                {agenda.items.map((item, i) => {
                    const locked = false //i >= 2
                    const deadlineStatus = item.deadline ? AgendaObject.getDeadlineStatus(new Date(item.deadline)) : undefined
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
                                        <LabelField label="Time">
                                            <InnerValue label={Utility.formatTime(item.step.duration)} />
                                        </LabelField>
                                        {deadlineStatus ? (
                                            <LabelField label="Deadline">
                                                <InnerValue
                                                    label={deadlineStatus === "on_time" ? "On Time" : "Past Due"}
                                                    color={item.step.completed ? undefined : deadlineStatus === "on_time" ? "var(--green)" : "var(--red)"}
                                                />
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
    )
}