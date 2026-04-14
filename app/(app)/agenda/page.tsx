"use client"
import { useState } from "react"
import PageFrame from "@/components/PageFrame"
import Agenda from "@/components/Agenda"

export default function AgendaPage() {
    const [tab, setTab] = useState<"today" | "tomorrow">("today")

    return (
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
            <Agenda day={tab} />
        </PageFrame>
    )
}