"use client"
import List, { ListItem } from "@/components/List"
import API from "@/lib/API"
import Item from "@/types/Item"
import { useState, useEffect, useContext } from "react"
import ControlCard from "@/components/ControlCard"
import Fieldset from "@/components/Fieldset"
import FieldFrame from "@/components/FieldFrame"
import ValueBox from "@/components/ValueBox"
import LabelField from "@/components/LabelField"
import InnerButton from "@/components/InnerButton"
import { DownArrowIcon } from "@/components/Icons"
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

export default function ItemList() {
    const [items, setItems] = useState<Item[]>([])
    const { user } = useContext(UserContext)
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState<Item | null>(null)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [stepsModalOpen, setStepsModalOpen] = useState(false)

    useEffect(() => {
        API.get<{ items: Item[] }>("/api/v1/items", true).then(data => {
            setItems(data.items)
        })
    }, [])

    const getDuration = (item: Item) => {
        let duration = 0
        item.steps.forEach(step => duration += step.duration)
        return duration
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
        API.delete(`/api/v1/tasks/${currentItem?.id}`, true).then(data => {
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

    if (!user) return

    return (
        <>
            <List>
                {items.map((item, i) => (
                    <ListItem key={i}>
                        <ControlCard
                            label={item.name}
                            onRequestEdit={() => handleRequestEdit(item)}
                            onRequestDelete={() => handleRequestDelete(item)}
                        >
                            <FieldFrame>
                                <Fieldset label="Description">
                                    <ValueBox fieldset value={item.description} />
                                </Fieldset>
                                <LabelField label="Steps">
                                    <InnerButton
                                        icon={<DownArrowIcon />}
                                        label={`${item.steps.length} ${item.steps.length === 1 ? "Step" : "Steps"}`}
                                        onClick={() => handleStepsClick(item)}
                                    />
                                </LabelField>
                                <LabelField label="Duration">
                                        <InnerValue label={Utility.formatTime(getDuration(item), averageHours(user))} />
                                    </LabelField>
                            </FieldFrame>
                        </ControlCard>
                    </ListItem>
                ))}
            </List>
            <Modal
                label="Steps"
                open={stepsModalOpen}
                onRequestClose={() => setStepsModalOpen(false)}
            >
                {currentItem ? (
                    <FieldFrame>
                        {currentItem.steps.map((step, i) => (
                            <Fieldset key={i} label={step.name}>
                                <ValueBox fieldset value={step.notes} />
                                <LabelField fieldset label="Duration">
                                    <InnerValue label={Utility.formatTime(step.duration, averageHours(user))} />
                                </LabelField>
                                <LabelField fieldset label="Completed">
                                    <Toggle on={!!step.completed} />
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