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

export default function UpdateAccentForm() {
    const [accent, setAccent] = useState<Accent>(Appearance.DEFAULT_ACCENT)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
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

                setAlertMessage("Accent Color Saved Successfully")
                setAlertOpen(true)
            }).catch(err => {
                setLoading(false)
                setAlertMessage(err.message)
                setAlertOpen(true)
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
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </Form>
    )
}