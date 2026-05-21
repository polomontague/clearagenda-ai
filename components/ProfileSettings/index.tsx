"use client"
import { useState } from "react"
import SelectBar from "@/components/SelectBar"
import UpdateNameForm from "@/components/UpdateNameForm"
import UpdateEmailForm from "@/components/UpdateEmailForm"
import UpdatePhoneForm from "@/components/UpdatePhoneForm"
import FieldFrame from "@/components/FieldFrame"

export default function ProfileSettings() {
    const [tab, setTab] = useState("name")

    const componentMap = {
        name: <UpdateNameForm />,
        email: <UpdateEmailForm />,
        phone: <UpdatePhoneForm />
    }

    return (
        <FieldFrame>
            <SelectBar
                options={[
                    { value: "name", label: "Name" },
                    { value: "email", label: "Email" },
                    { value: "phone", label: "Phone" }
                ]}
                value={tab}
                onChange={(val) => setTab(val)}
            />
            {componentMap[tab as "name" | "email" | "phone"]}
        </FieldFrame>
    )
}