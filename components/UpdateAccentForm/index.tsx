"use client"
import Form from "@/components/Form"
import AccentPicker from "@/components/AccentPicker"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Accent from "@/types/Accent"
import Appearance from "@/constants/Appearance"
import Fieldset from "@/components/Fieldset"
import LabelField from "@/components/LabelField"
import InnerValue from "@/components/InnerValue"
import Loading from "@/components/Loading"
import API from "@/lib/API"
import { CheckMarkIcon, WarningIcon } from "../Icons"

export default function UpdateAccentForm() {
    const [accent, setAccent] = useState<Accent>(Appearance.DEFAULT_ACCENT)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
    const [loading, setLoading] = useState(false)
    const labelMap = {
        red: "Red",
        orange: "Orange",
        coral: "Coral",
        yellow: "Yellow",
        lime: "Lime",
        green: "Green",
        mint: "Mint",
        turquoise: "Turquoise",
        sky: "Sky",
        lavender: "Lavender",
        pink: "Pink"
    }

    useEffect(() => {
        if (user) {
            setAccent(user.preferences.accent)
        }
    }, [user])

    const handleSubmit = () => {
        if (cookies.token) {
            setLoading(true)
            API.put<{ accent: Accent }>(`/api/v1/users/${user!.id}/preferences/accent`, {
                accent
            }, true).then(data => {
                setLoading(false)
                const newUser = { ...user! }
                newUser.preferences.accent = data.accent
                setUser(newUser)
                setAlert({
                    label: "Updated",
                    icon: <CheckMarkIcon />,
                    message: "Accent Color Updated Successfully",
                    open: true
                })
            }).catch(err => {
                setLoading(false)
                setAlert({
                    label: "Error",
                    icon: <WarningIcon />,
                    message: err.message,
                    open: true
                })
            })
        } else {
            router.push("/login")
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset>
                    <LabelField fieldset label="Color">
                        <InnerValue
                            color={`var(--${accent})`}
                            label={labelMap[accent]}
                        />
                    </LabelField>
                    <AccentPicker fieldset value={accent} onChange={(val) => setAccent(val)} />
                </Fieldset>
                <Button label="Update Accent Color" />
            </FieldFrame>
            <Loading loading={loading} />
            <Alert
                label={alert.label}
                icon={alert.icon}
                message={alert.message}
                open={alert.open}
                onRequestClose={() => setAlert({ ...alert, open: false })}
            />
        </Form>
    )
}