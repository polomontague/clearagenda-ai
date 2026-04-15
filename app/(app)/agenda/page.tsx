"use client"
import { useState } from "react"
import PageFrame from "@/components/PageFrame"
import Agenda from "@/components/Agenda"
import SelectBar from "@/components/SelectBar"

export default function AgendaPage() {
    const [tab, setTab] = useState<"today" | "tomorrow">("today")

    return (
        <PageFrame
            header={{
                center: (
                    <SelectBar
                        layer={2}
                        options={[
                            { value: "today", label: "Today" },
                            { value: "tomorrow", label: "Tomorrow" }
                        ] as const}
                        value={tab}
                        onChange={(val) => setTab(val)}
                    />
                )
            }}
        >
            <Agenda day={tab} />
        </PageFrame>
    )
}