"use client"
import List, { ListItem } from "@/components/List"
import API from "@/lib/API"
import Item, { Task, Event } from "@/types/Item"
import { useState, useContext, useMemo } from "react"
import Fieldset from "@/components/Fieldset"
import FieldFrame from "@/components/FieldFrame"
import ValueBox from "@/components/ValueBox"
import LabelField from "@/components/LabelField"
import { EditIcon, TrashCanIcon } from "@/components/Icons"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"
import UserContext from "@/contexts/UserContext"
import User from "@/types/User"
import Alert from "@/components/Alert"
import Confirm from "@/components/Confirm"
import FormModal from "@/components/FormModal"
import ItemForm from "@/components/ItemForm"
import Modal from "@/components/Modal"
import Toggle from "@/components/Toggle"
import ItemsContext from "@/contexts/ItemsContext"
import Card from "@/components/Card"
import Range from "@/components/Range"

type ItemListProps = {
    filters: {
        search: string,
        completed: boolean
    }
}

export default function ItemList({ filters: { search, completed } }: ItemListProps) {
    const { items, setItems } = useContext(ItemsContext)
    const { user } = useContext(UserContext)
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<Item | null>(null)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [stepsModalOpen, setStepsModalOpen] = useState(false)
    const today = new Date()
    const filteredItems = useMemo(() => {
        const completionItems = items.map(item => {
            return {
                ...item,
                completed: getCompleted(item)
            }
        })
        return completionItems.filter(item => {
            //if (!completed && item.completed) return false
            if (item.name.toLowerCase().includes(search.toLowerCase())) return true
            if (item.type === "task") {
                if (item.description.toLowerCase().includes(search.toLowerCase())) return true
                for (const step of item.steps) {
                    if (step.name.toLowerCase().includes(search.toLowerCase())) return true
                    if (step.notes.toLowerCase().includes(search.toLowerCase())) return true
                }
            } else if (item.type === "event") {
                if (item.notes && item.notes.toLowerCase().includes(search.toLowerCase())) return true
            }
            return false
        })
    }, [items, search, completed])

    function getCompleted(item: Item) {
        if (item.type === "task") {
            for (let i = 0; i < item.steps.length; i++) {
                if (!item.steps[i].completed) {
                    return false
                }
            }
        } else if (item.type === "event") {
            if (item.occurs === "once") {
                const ends = new Date(item.starts)
                ends.setMinutes(ends.getMinutes() + item.duration)
                if (new Date(ends).getTime() > today.getTime()) completed = false
            }
            if (item.occurs === "repeating") {
                return false // Ongoing repeat ing events are not completed
            }
        }
        return true
    }

    const getEventEnds = (item: Event) => {

        return new Date()
    }

    const getTaskDuration = (item: Item) => {
        let duration = 0
        if (item.type === "task") {
            item.steps.forEach(step => duration += step.duration)
        } else if (item.type === "event") {
            // add duration for events
        }
        return duration
    }

    const getCompletion = (item: Task) => {
        let totalMinutes = 0
        let completedMinutes = 0
        for (const step of item.steps) {
            totalMinutes += step.duration
            if (step.completed) completedMinutes += step.duration
        }
        return Math.round((completedMinutes / totalMinutes) * 100) / 100
    }

    const averageHours = (user: User) => {
        let total = 0
        Object.keys(user.preferences.hours).forEach((key) => {
            total += user.preferences.hours[key as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"]
        })
        return total / 7
    }

    const handleRequestEdit = (item: Item) => {
        setCurrentItem(item)
        setEditModalOpen(true)
    }

    const handleEditSuccess = (item: Item) => {
        setEditModalOpen(false)
        const newItems = [ ...items ]
        const index = newItems.findIndex(item2 => item2.id === item.id)
        newItems[index] = item
        setItems(newItems)
        setAlertMessage(`"${item.name}" Updated Successfully`)
        setAlertOpen(true)
    }

    const handleRequestDelete = (item: Item) => {
        setCurrentItem(item)
        setConfirmMessage(`Delete "${item.name}"?`)
        setConfirmOpen(true)
    }

    const handleDeleteConfirm = () => {
        setConfirmOpen(false)
        API.delete(`/api/v1/items/${currentItem?.id}`, true).then(() => {
            const newItems = items.filter(item => item.id !== currentItem?.id)
            setItems(newItems)
            setAlertMessage(`"${currentItem?.name}" Deleted Successfully`)
            setAlertOpen(true)
        }).catch(err => {
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    const handleStepsClick = (item: Item) => {
        setCurrentItem(item)
        setStepsModalOpen(true)
    }

    const handleCompletedChange = (item: Task, step: Step) => {
        const prevCompleted = step.completed
        const newCompleted = step.completed ? undefined : new Date().toISOString()
        updateCompleted(item, step, newCompleted)
        let url = `/api/v1/items/${item.id}/steps/${step.id}`
        url += prevCompleted ? "/uncomplete" : "/complete"
        API.post<{ completed?: string }>(url, {}, true).catch(err => {
            updateCompleted(item, step, prevCompleted)
        })
    }

    const updateCompleted = (item: Task, step: Step, completed?: string) => {
        const newItems = [ ...items ]
        const foundItem = newItems.find(item2 => item2.id === item.id)
        if (foundItem?.type === "task") {
            const foundStep = foundItem.steps.find(step2 => step2.id === step.id)
            if (foundStep) foundStep.completed = completed
        }
        setItems(newItems)
    }

    const getEventTimesLabel = (item: Event) => {
        const starts = new Date(item.starts)
        const ends = new Date(starts)
        ends.setMinutes(ends.getMinutes() + item.duration)
        return `${Utility.formatTime(starts)} - ${Utility.formatTime(ends)}`
    }

    const getStatus = (item: Item): { color: string, label: string } => {
        if (item.type === "task") {
            if (item.occurs === "once") {
                const completed = getCompleted(item)
                if (completed) return { color: "var(--layer-4-light)", label: "Completed" }
                return { color: "var(--yellow)", label: "Scheduled" }
            }
            if (item.occurs === "repeating") {
                return { color: "var(--sky)", label: "Repeating" }
            }
        }
        if (item.type === "event") {
            if (item.occurs === "once") {
                const completed = getCompleted(item)
                if (completed) return { color: "var(--layer-4-light)", label: "Passed" }
                return { color: "var(--yellow)", label: "Scheduled" }
            }
            if (item.occurs === "repeating") {
                return { color: "var(--sky)", label: "Repeating" }
            }
        }
        return { color: "", label: "" }
    }

    if (!user) return

    return (
        <>
            <List>
                {filteredItems.map((item, i) => {
                    const repeatLabel = item.occurs === "repeating" ? Utility.getRepeatLabel(item.repeat) : undefined
                    const status = getStatus(item)
                    console.log(status)
                    return (
                        <ListItem key={i}>
                            <Card
                                label={item.name}
                                buttons={[
                                    { icon: <EditIcon />, onClick: () => handleRequestEdit(item) },
                                    { icon: <TrashCanIcon />, onClick: () => handleRequestDelete(item) }
                                ]}
                            >
                                <FieldFrame>
                                    {item.type === "task" ? (
                                        item.occurs === "once" ? (
                                            <>
                                                <LabelField label="Time">
                                                    <InnerValue label={Utility.formatDuration(getTaskDuration(item))} />
                                                </LabelField>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : item.occurs === "repeating" ? (
                                            <>
                                                <Fieldset description={repeatLabel}>
                                                    <LabelField fieldset label="Time">
                                                        <InnerValue
                                                            label={Utility.formatDuration(getTaskDuration(item))}
                                                        />
                                                    </LabelField>
                                                </Fieldset>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : <></>
                                    ) : item.type === "event" ? (
                                        item.occurs === "once" ? (
                                            <>
                                                <LabelField label="Time">
                                                    <InnerValue label={getEventTimesLabel(item)} />
                                                </LabelField>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : item.occurs === "repeating" ? (
                                            <>
                                                <Fieldset description={repeatLabel}>
                                                    <LabelField fieldset label="Time">
                                                        <InnerValue label={getEventTimesLabel(item)} />
                                                    </LabelField>
                                                </Fieldset>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : <></>
                                    ) : <></>}
                                </FieldFrame>
                            </Card>
                        </ListItem>
                    )
                })}
            </List>
            <Modal
                label="Steps"
                open={stepsModalOpen}
                onRequestClose={() => setStepsModalOpen(false)}
            >
                {currentItem && currentItem.type === "task" ? (
                    <FieldFrame>
                        {currentItem.steps.map((step, i) => (
                            <Fieldset key={i} label={step.name}>
                                <ValueBox fieldset value={step.notes} />
                                <LabelField fieldset label="Duration">
                                    <InnerValue label={Utility.formatDuration(step.duration, averageHours(user))} />
                                </LabelField>
                                <LabelField fieldset label="Completed">
                                    <Toggle
                                        on={!!step.completed}
                                        onChange={() => handleCompletedChange(currentItem, step)}
                                    />
                                </LabelField>
                            </Fieldset>
                        ))}
                    </FieldFrame>
                ) : null}
            </Modal>
            <FormModal
                label="Edit Agenda Item"
                open={editModalOpen}
                onRequestCancel={() => setEditModalOpen(false)}
            >
                {currentItem ? (
                    <ItemForm
                        type="edit"
                        item={currentItem}
                        onSuccess={handleEditSuccess}
                    />
                ) : null}
            </FormModal>
            <Confirm
                message={confirmMessage}
                open={confirmOpen}
                onRequestCancel={() => setConfirmOpen(false)}
                onRequestConfirm={handleDeleteConfirm}
            />
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </>
    )
}