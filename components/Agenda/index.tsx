"use client"
import { useState, useContext, useEffect } from "react"
import { AgendaItem } from "@/types/Agenda"
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
import Item from "@/types/Item"
import User from "@/types/User"

type AgendaProps = {
    date: Date
}

type Day = Record<number, Item>

type Days = Record<string, Day>

const getDateItems = (items: Item[], date: Date, hours: User["preferences"]["hours"]) => {
    items.sort((a, b) => b.priority - a.priority)
    const days: Days = {}
    const currentDate = new Date()
    const weekdays: (keyof User["preferences"]["hours"])[] = [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ]
    for (const item of items) {
        for (const step of item.steps) {
            if (step.completed) {
                const key = new Date(step.completed).toLocaleDateString("en-CA")
                if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                if (!days[key][item.id]) days[key][item.id] = { // Add item to date if it doesn't already exist
                    ...item,
                    steps: []
                }
                days[key][item.id].steps.push(step)
            } else {
                let key = currentDate.toLocaleDateString("en-CA")
                if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                const minutes = getDayMinutes(days[key])
                const minutesLimit = hours[weekdays[currentDate.getDay()]] * 60
                if (minutes + step.duration >= minutesLimit) { // Start new day if current day is full
                    currentDate.setDate(currentDate.getDate() + 1)
                }
                key = currentDate.toLocaleDateString("en-CA")
                if (!days[key]) days[key] = {} // Add date to days if it doesn't already exist
                if (!days[key][item.id]) days[key][item.id] = { // Add item to date if it doesn't already exist
                    ...item,
                    steps: []
                }
                days[key][item.id].steps.push(step)
            }
        }
    }
    const key = date.toLocaleDateString("en-CA")
    const day = days[key] ? days[key] : []
    return Object.entries(day).map(([_, item]) => item)
}

const getDayMinutes = (day: Day) => {
    let minutes = 0
    Object.entries(day).forEach(([_, item]) => {
        for (const step of item.steps) {
            minutes += step.duration
        }
    })
    return minutes
}

const getCurrent = (items: Item[]) => {
    for (let i = 0; i < items.length; i++) {
        for (let i2 = 0; i2 < items[i].steps.length; i2++) {
            if (!items[i].steps[i2].completed) {
                return {
                    item: items[i],
                    step: items[i].steps[i2]
                }
            }
        }
    }
}

export default function Agenda(props: AgendaProps) {
    const { items } = useContext(ItemsContext)
    const [agendaItems, setAgendaItems] = useState<Item[]>([])
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const { user } = useContext(UserContext)
    const current = getCurrent(agendaItems)
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
            const foundStep = foundItem?.steps.find(step => step.id === current.step.id)
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
                            
                            return (
                                <Card key={i} label={item.name}>
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
                                    <LabelField label="Time">
                                        <InnerValue label={Utility.formatTime(current.step.duration)} />
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