"use client"
import List, { ListItem } from "@/components/List"
import Reminder from "@/types/Reminder"
import Card from "@/components/Card"
import LabelField from "../LabelField"
import InnerValue from "../InnerValue"
import FieldFrame from "../FieldFrame"
import Reminders from "@/lib/Reminders"
import { useContext } from "react"
import UserContext from "@/contexts/UserContext"

type ReminderListProps = {
    reminders: Reminder[]
}

export default function ReminderList(props: ReminderListProps) {
    const { user } = useContext(UserContext)

    if (!user) return

    return (
        <List>
            {props.reminders.map((reminder, i) => {
                const status = Reminders.getStatus(reminder, user)
                return (
                    <ListItem key={i}>
                        <Card label={reminder.name}>
                            <FieldFrame>
                                <LabelField label="At">
                                    <InnerValue label={Reminders.getAt(reminder)} />
                                </LabelField>
                                <LabelField label="Status">
                                    <InnerValue
                                        color={status.color}
                                        label={status.label}
                                    />
                                </LabelField>
                            </FieldFrame>
                        </Card>
                    </ListItem>
                )
            })}
        </List>
    )
}