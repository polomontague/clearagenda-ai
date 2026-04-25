"use client"
import Modal from "@/components/Modal"
import Item, { Task, Step } from "@/types/Item"
import Fieldset from "@/components/Fieldset"
import FieldFrame from "@/components/FieldFrame"
import LabelField from "@/components/LabelField"
import ValueBox from "@/components/ValueBox"
import Toggle from "@/components/Toggle"
import API from "@/lib/API"
import { Fragment } from "react"
import InnerValue from "@/components/InnerValue"
import Utility from "@/lib/Utility"
import { useMemo, useContext } from "react"
import UserContext from "@/contexts/UserContext"
import Range from "@/components/Range"

type ItemModalProps = {
    item: Item,
    items: {
        value: Item[],
        onChange: (value: Item[]) => void
    }
    open: boolean,
    onRequestClose: () => void
}

export default function ItemModal(props: ItemModalProps) {
    const { user } = useContext(UserContext)
    const status = useMemo(() => Utility.getItemStatus(props.item, user!.preferences.accent), [ props.item, user ])
    const completion = props.item.type === "task" ? Utility.getTaskCompletion(props.item) : 0
    
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
        const newItems = [ ...props.items.value ]
        const foundItem = newItems.find(item2 => item2.id === item.id)
        if (foundItem?.type === "task") {
            const foundStep = foundItem.steps.find(step2 => step2.id === step.id)
            if (foundStep) foundStep.completed = completed
        }
        props.items.onChange(newItems)
    }

    const renderSteps = (item: Task) => {
        return (
            <Fieldset label="Steps">
                {item.steps.map((step, i) => (
                    <Fragment key={i}>
                        <LabelField fieldset label={step.name} />
                        <ValueBox fieldset value={step.notes} />
                        <LabelField fieldset label="Completed">
                            <Toggle
                                on={!!step.completed}
                                onChange={() => handleCompletedChange(item, step)}
                            />
                        </LabelField>
                    </Fragment>
                ))}
            </Fieldset>
        )
    }

    return (
        <Modal
            open={props.open}
            label={props.item.name}
            onRequestClose={props.onRequestClose}
        >
            <FieldFrame>
                {props.item.type === "task" ? (
                    props.item.occurs === "once" ? (
                        <>
                            {renderSteps(props.item)}
                            {props.item.deadline ? (
                                <LabelField label="Deadline">
                                    <InnerValue label={Utility.formatDate(new Date(props.item.deadline))} />
                                </LabelField>
                            ) : null}
                            <Fieldset>
                                <LabelField fieldset label="Completion">
                                    <InnerValue label={`${Math.round(completion * 100)}%`} />
                                </LabelField>
                                <Range fieldset value={completion} />
                            </Fieldset>
                            <LabelField label="Status">
                                <InnerValue color={status.color} label={status.label} />
                            </LabelField>
                        </>
                    ) : props.item.occurs === "repeating" ? (
                        <>
                            {renderSteps(props.item)}
                            <Fieldset description={Utility.getRepeatLabel(props.item.repeat)}>
                                <LabelField fieldset label="Length">
                                    <InnerValue label={Utility.formatTaskLength(props.item)} />
                                </LabelField>
                            </Fieldset>
                            <Fieldset>
                                <LabelField fieldset label="Completion">
                                    <InnerValue label={`${Math.round(completion * 100)}%`} />
                                </LabelField>
                                <Range fieldset value={completion} />
                            </Fieldset>
                            <LabelField label="Status">
                                <InnerValue color={status.color} label={status.label} />
                            </LabelField>
                        </>
                    ) : <></>
                ) : props.item.type === "event" ? (
                    props.item.occurs === "once" ? (
                        <>
                            <Fieldset>
                                <LabelField fieldset label="Date">
                                    <InnerValue label={Utility.formatDate(new Date(props.item.starts))} />
                                </LabelField>
                                <LabelField fieldset label="From">
                                    <InnerValue label={Utility.formatEventFrom(props.item)} />
                                </LabelField>
                            </Fieldset>
                            {props.item.notes ? (
                                <Fieldset label="Notes">
                                    <ValueBox fieldset value={props.item.notes} />
                                </Fieldset>
                            ) : null}
                            <LabelField label="Status">
                                <InnerValue color={status.color} label={status.label} />
                            </LabelField>
                        </>
                    ) : props.item.occurs === "repeating" ? (
                        <>  
                            <Fieldset description={Utility.getRepeatLabel(props.item.repeat)}>
                                <LabelField fieldset label="From">
                                    <InnerValue label={Utility.formatEventFrom(props.item)} />
                                </LabelField>
                            </Fieldset>
                            {props.item.notes ? (
                                <Fieldset label="Notes">
                                    <ValueBox fieldset value={props.item.notes} />
                                </Fieldset>
                            ) : null}
                            <LabelField label="Status">
                                <InnerValue color={status.color} label={status.label} />
                            </LabelField>
                        </>
                    ) : <></>
                ) : <></>}
            </FieldFrame>
        </Modal>
    )
}