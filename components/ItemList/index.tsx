"use client"
import List, { ListItem } from "@/components/List"
import API from "@/lib/API"
import Item, { Event } from "@/types/Item"
import { useState, useContext, useMemo } from "react"
import Fieldset from "@/components/Fieldset"
import FieldFrame from "@/components/FieldFrame"
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
import ItemsContext from "@/contexts/ItemsContext"
import Card from "@/components/Card"
import ItemModal from "./ItemModal"
import Button from "@/components/Button"

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
    const [currentId, setCurrentId] = useState(0)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const today = new Date()
    const filteredItems = useMemo(() => {
        const completionItems = items.map(item => {
            return {
                ...item,
                completed: Utility.getItemCompleted(item)
            }
        })
        return completionItems.filter(item => {
            if (!completed && item.completed) return false
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
    const currentItem = useMemo(() => items.find(item => item.id === currentId), [ items, currentId ])
    const STATUSES: Record<"completed" | "overdue" | "upcoming" | "in_progress" | "repeating" | "ended", { color: string, label: string }> = {
        upcoming: { color: user?.preferences.accent === "sky" ? "var(--turquoise)" : "var(--sky)", label: "Upcoming" },
        overdue: { color: user?.preferences.accent === "red" ? "var(--coral)" : "var(--red)", label: "Overdue" },
        in_progress: { color: user?.preferences.accent === "yellow" ? "var(--orange)" : "var(--yellow)", label: "In Progress" },
        repeating: { color: user?.preferences.accent === "lavender" ? "var(--pink)" : "var(--lavender)", label: "Repeating" },
        completed: { color: "var(--layer-4-light)", label: "Completed" },
        ended: { color: "var(--layer-4-light)", label: "Ended" }
    }

    const getEventEnds = (item: Event) => {

        return new Date()
    }

    const averageHours = (user: User) => {
        let total = 0
        Object.keys(user.preferences.hours).forEach((key) => {
            total += user.preferences.hours[key as "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday"]
        })
        return total / 7
    }

    const handleRequestEdit = (item: Item) => {
        setCurrentId(item.id)
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
        setCurrentId(item.id)
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

    const handleItemClick = (item: Item) => {
        setCurrentId(item.id)
        setModalOpen(true)
    }

    if (!user) return

    return (
        <>
            <List>
                {filteredItems.map((item, i) => {
                    const repeatLabel = item.occurs === "repeating" ? Utility.getRepeatLabel(item.repeat) : undefined
                    const statusCode = Utility.getItemStatus(item)
                    const status = STATUSES[statusCode]
                    return (
                        <ListItem key={i}>
                            <Card
                                label={item.name}
                                buttons={[
                                    {
                                        icon: <EditIcon />,
                                        disabled: statusCode === "completed" || statusCode === "ended",
                                        onClick: () => handleRequestEdit(item) },
                                    {
                                        icon: <TrashCanIcon />,
                                        onClick: () => handleRequestDelete(item)
                                    }
                                ]}
                            >
                                <FieldFrame>
                                    {item.type === "task" ? (
                                        item.occurs === "once" ? (
                                            <>
                                                <LabelField label="Length">
                                                    <InnerValue label={Utility.formatTaskLength(item)} />
                                                </LabelField>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : item.occurs === "repeating" ? (
                                            <>
                                                <Fieldset description={repeatLabel}>
                                                    <LabelField fieldset label="Length">
                                                        <InnerValue
                                                            label={Utility.formatTaskLength(item)}
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
                                                <LabelField label="From">
                                                    <InnerValue label={Utility.formatEventFrom(item)} />
                                                </LabelField>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : item.occurs === "repeating" ? (
                                            <>
                                                <Fieldset description={repeatLabel}>
                                                    <LabelField fieldset label="From">
                                                        <InnerValue label={Utility.formatEventFrom(item)} />
                                                    </LabelField>
                                                </Fieldset>
                                                <LabelField label="Status">
                                                    <InnerValue color={status.color} label={status.label} />
                                                </LabelField>
                                            </>
                                        ) : <></>
                                    ) : <></>}
                                    <Button
                                        label="See Details"
                                        onClick={() => handleItemClick(item)}
                                    />
                                </FieldFrame>
                            </Card>
                        </ListItem>
                    )
                })}
            </List>
            {currentItem ? (
                <ItemModal
                    item={currentItem}
                    items={{
                        value: items,
                        onChange: setItems
                    }}
                    open={modalOpen}
                    onRequestClose={() => setModalOpen(false)}
                />
            ) : null}
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