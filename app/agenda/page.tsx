"use client"
import { useState, useEffect } from "react"
import FormModal from "@/components/FormModal"
import TaskForm from "@/components/TaskForm"
import SelectButton from "@/components/SelectButton"
import { PlusIcon } from "@/components/Icons"
import Task from "@/types/Task"
import PrivateRoute from "@/components/PrivateRoute"
import PageFrame from "@/components/PageFrame"
import Agenda from "@/components/Agenda"
import axios from "axios"
import { useCookies } from "react-cookie"

export default function AgendaPage() {
    const [tab, setTab] = useState("today")
    const [addTaskOpen, setAddTaskOpen] = useState(false)
    const [todayAgenda, setTodayAgenda] = useState()
    const [tomorrowAgenda, setTomorrowAgenda] = useState()
    const [cookies] = useCookies()

    useEffect(() => {
        getAgenda("today")
        getAgenda("tomorrow")
    }, [])

    const getAgenda = (day: "today" | "tomorrow") => {
        const date = new Date()
        if (day === "tomorrow") date.setDate(date.getDate() + 1)
        const dateString = date.toISOString().slice(0, 10)
        axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/agenda?date=${dateString}`, {
            headers: {
                Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
            }
        }).then(res => {
            const agenda = res.data.data.agenda
            if (day === "today") setTodayAgenda(agenda)
            if (day === "tomorrow") setTomorrowAgenda(agenda)
        })
    }

    const handleAddTaskSuccess = (task: Task) => {
        setAddTaskOpen(false)
        console.log(task)
    }

    return (
        <PrivateRoute>
            <PageFrame
                tabs={{
                    options: [
                        { value: "today", label: "Today" },
                        { value: "tomorrow", label: "Tomorrow" }
                    ],
                    value: tab,
                    onChange: setTab
                }}
            >
                {tab === "today" ? (
                    <>
                        {todayAgenda ? (
                            <Agenda label="Today's Agenda" agenda={todayAgenda} />
                        ) : null}
                    </>
                ) : tab === "tomorrow" ? (
                    <>
                        {tomorrowAgenda ? (
                            <Agenda label="Tomorrow's Agenda" agenda={tomorrowAgenda} />
                        ) : null}
                    </>
                ) : null}
                <SelectButton
                    icon={<PlusIcon />}
                    options={[
                        {
                            icon: <PlusIcon />,
                            label: "Task",
                            onClick: () => setAddTaskOpen(true)
                        },
                        {
                            icon: <PlusIcon />,
                            label: "Event",
                            onClick: () => {}
                        }
                    ]}
                />
                <FormModal
                    open={addTaskOpen}
                    label="Add Task"
                    onRequestCancel={() => setAddTaskOpen(false)}
                >
                    <TaskForm type="new" onSuccess={handleAddTaskSuccess} />
                </FormModal>
            </PageFrame>
        </PrivateRoute>
    )
}