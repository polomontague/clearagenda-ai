"use client"
import { useState, useEffect, ReactNode } from "react"
import Reminder from "@/types/Reminder"
import RemindersContext from "@/contexts/RemindersContext"
import API from "@/lib/API"

export default function RemindersProvider(props: {
    children: ReactNode
}) {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        API.get<{ reminders: Reminder[] }>("/api/v1/reminders", true).then(data => {
            setReminders(data.reminders)
            setLoading(false)
        }).catch(() => {
            setLoading(false)
        })
    }, [])

    const addReminder = (reminder: Reminder) => {
        setReminders([ ...reminders, reminder ])
    }

    const replaceReminder = (reminder: Reminder) => {
        const newReminders = [ ...reminders ]
        const index = newReminders.findIndex(reminder2 => reminder2.id === reminder.id)
        newReminders[index] = reminder
        setReminders(newReminders)
    }

    const removeReminder = (reminder: Reminder) => {
        const newReminders = reminders.filter(reminder2 => reminder2.id !== reminder.id)
        setReminders(newReminders)
    }

    return (
        <RemindersContext.Provider
            value={{
                reminders,
                addReminder,
                replaceReminder,
                removeReminder,
                loading
            }}
        >
            {props.children}
        </RemindersContext.Provider>
    )
}