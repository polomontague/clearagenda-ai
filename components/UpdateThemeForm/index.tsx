"use client"
import Form from "@/components/Form"
import ThemePicker from "@/components/ThemePicker"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import axios from "axios"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Theme from "@/types/Theme"
import Fieldset from "@/components/Fieldset"
import Appearance from "@/constants/Appearance"

export default function UpdateThemeForm() {
    const [theme, setTheme] = useState<Theme>(Appearance.DEFAULT_THEME)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setTheme(user.preferences.theme)
        }
    }, [user])

    const handleSubmit = () => {
        if (cookies.token) {
            setSubmitLoading(true)
            axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${user!.id}/preferences/theme`, {
                theme
            }, {
                headers: {
                    Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
                }
            }).then(res => {
                setSubmitLoading(false)
                const newUser = { ...user! }
                newUser.preferences.theme = res.data.data.theme
                setUser(newUser)

                setAlertMessage("Theme Saved Successfully")
                setAlertOpen(true)
            }).catch(err => {
                setSubmitLoading(false)
                setAlertMessage(err.response.data.error.message)
                setAlertOpen(true)
            })
        } else {
            router.push("/login")
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset label="Theme">
                    <ThemePicker fieldset value={theme} onChange={(val) => setTheme(val)} />
                </Fieldset>
                <Button
                    label="Update Theme"
                    loading={submitLoading}
                />
            </FieldFrame>
            <Alert
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
        </Form>
    )
}