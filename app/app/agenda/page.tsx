"use client"
import { useState } from "react"
import PageFrame from "@/components/PageFrame"
import SelectBar from "@/components/SelectBar"
import DatePicker from "@/components/DatePicker"
import Modal from "@/components/Modal"
import SquareButton from "@/components/SquareButton"
import { CalendarIcon } from "@/components/Icons"
import DateEvents from "@/components/DateEvents"
import DateReminders from "@/components/DateReminders"
import DateTasks from "@/components/DateTasks"

export default function AgendaPage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [date, setDate] = useState(new Date())
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const [type, setType] = useState<"tasks" | "events" | "reminders">("tasks")

    const handleDateChange = (val: Date) => {
        setDate(val)
        setModalOpen(false)
    }

    const handleTabChange = (val: string) => {
        if (val === "today") {
            setDate(new Date())
        }
        if (val === "tomorrow") {
            const date = new Date()
            date.setDate(date.getDate() + 1)
            setDate(date)
        }
    }

    return (
        <PageFrame
            header={{
                center: (
                    <SelectBar
                        options={[
                            { value: "tasks", label: "Tasks" },
                            { value: "events", label: "Events" },
                            { value: "reminders", label: "Reminders" }
                        ] as const}
                        value={type}
                        onChange={setType}
                    />
                ),
                right: (
                    <SquareButton
                        icon={<CalendarIcon />}
                        onClick={() => setModalOpen(true)}
                    />
                )
            }}
        >
            {type === "tasks" ? (
                <DateTasks date={date} />
            ) : type === "events" ? (
                <DateEvents date={date} />
            ) : type === "reminders" ? (
                <DateReminders date={date} />
            ) : null}
            <Modal
                label="Choose Date"
                open={modalOpen}
                onRequestClose={() => setModalOpen(false)}
            >
                <DatePicker value={date} onChange={handleDateChange} />
            </Modal>
        </PageFrame>
    )
}