"use client"
import UpdatePreferencesHoursForm from "@/components/UpdatePreferencesHoursForm"
import UpdateAccentForm from "@/components/UpdateAccentForm"
import { useState } from "react"
import SelectBar from "@/components/SelectBar"
import FieldFrame from "@/components/FieldFrame"
import UpdateThemeForm from "@/components/UpdateThemeForm"

export default function PreferencesSettings() {
    const [tab, setTab] = useState("hours")

    const elementMap = {
        hours: <UpdatePreferencesHoursForm />,
        appearance: (
            <>
                <UpdateThemeForm />
                <UpdateAccentForm />
            </>
        )
    }

    return (
        <FieldFrame>
            <SelectBar
                options={[
                    { value: "hours", label: "Work Hours" },
                    { value: "appearance", label: "Appearance" }
                ]}
                value={tab}
                onChange={(val) => setTab(val)}
            />
            {elementMap[tab as "hours" | "appearance"]}
        </FieldFrame>
    )
}