"use client"
import { useState } from "react"
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

type AgendaProps = {
    label: string,
    agenda: AgendaType
}

export default function Agenda(props: AgendaProps) {
    const [confirmMessage, setConfirmMessage] = useState("")
    const [confirmOpen, setConfirmOpen ] = useState(false)
    const [currentItem, setCurrentItem] = useState<AgendaItem | undefined>()

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
        console.log(currentItem)
    }

    return (
        <>
            <List>
                {props.agenda.items.map((item, i) => {
                    const locked = i >= 2
                    const completed = i === 0
                    return (
                        <ListItem key={i}>
                            {item.type === "task" && item.task.type === "simple" ? (
                                <Card
                                    label={item.task.name}
                                    locked={locked}
                                    completed={completed}
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
                                        completed={completed}
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
            <Confirm
                message={confirmMessage}
                open={confirmOpen}
                onRequestCancel={() => setConfirmOpen(false)}
                onRequestConfirm={handleCompleteConfirm}
            />
        </>
    )
}