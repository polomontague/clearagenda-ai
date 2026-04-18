"use client"
import { useState } from "react"
import PageFrame from "@/components/PageFrame"
import Agenda from "@/components/Agenda"
import SelectBar from "@/components/SelectBar"
import DatePicker from "@/components/DatePicker"
import Modal from "@/components/Modal"
import SquareButton from "@/components/SquareButton"
import { CalendarIcon } from "@/components/Icons"

export default function AgendaPage() {
    const [modalOpen, setModalOpen] = useState(false)
    const [date, setDate] = useState(new Date())
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const tabMap = {
        [today.toLocaleDateString("en-CA")]: "today",
        [tomorrow.toLocaleDateString("en-CA")]: "tomorrow"
    }

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
                        layer={2}
                        options={[
                            { value: "today", label: "Today" },
                            { value: "tomorrow", label: "Tomorrow" }
                        ]}
                        value={tabMap[date.toLocaleDateString("en-CA")]}
                        onChange={handleTabChange}
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
            <Agenda date={date} />
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