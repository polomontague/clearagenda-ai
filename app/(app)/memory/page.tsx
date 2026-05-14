"use client"
import { useState, useContext } from "react"
import ItemList from "@/components/ItemList"
import PageFrame from "@/components/PageFrame"
import SearchInput from "@/components/SearchInput"
import { ControlsIcon } from "@/components/Icons"
import SquareButton from "@/components/SquareButton"
import Modal from "@/components/Modal"
import LabelField from "@/components/LabelField"
import Toggle from "@/components/Toggle"
import FieldFrame from "@/components/FieldFrame"
import SelectBar from "@/components/SelectBar"
import TaskList from "@/components/TaskList"
import TasksContext from "@/contexts/TasksContext"
import EventList from "@/components/EventList"
import EventsContext from "@/contexts/EventsContext"
import ReminderList from "@/components/ReminderList"
import RemindersContext from "@/contexts/RemindersContext"

export default function MemoryPage() {
    const [search, setSearch] = useState("")
    const [filterModalOpen, setFilterModalOpen] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [tab, setTab] = useState<"tasks" | "events" | "reminders">("tasks")
    const { tasks } = useContext(TasksContext)
    const { events } = useContext(EventsContext)
    const { reminders } = useContext(RemindersContext)

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
                        value={tab}
                        onChange={(val) => setTab(val)}
                    />
                ),
                right: (
                    <SquareButton
                        icon={<ControlsIcon />}
                        onClick={() => setFilterModalOpen(true)}
                    />
                )
            }}
        >
            {tab === "tasks" ? (
                <TaskList tasks={tasks} />
            ) : tab === "events" ? (
                <EventList events={events} />
            ) : tab === "reminders" ? (
                <ReminderList reminders={reminders} />
            ) : null}
            <Modal
                label="Filter Agenda Items"
                open={filterModalOpen}
                onRequestClose={() => setFilterModalOpen(false)}
            >
                <FieldFrame>
                    <LabelField label="Completed">
                        <Toggle on={completed} onChange={(val) => setCompleted(val)} />
                    </LabelField>
                </FieldFrame>
            </Modal>
        </PageFrame>
    )
}