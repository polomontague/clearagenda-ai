"use client"
import Form from "@/components/Form"
import ThemePicker from "@/components/ThemePicker"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Theme from "@/types/Theme"
import Fieldset from "@/components/Fieldset"
import Appearance from "@/constants/Appearance"
import LabelField from "@/components/LabelField"
import Toggle from "@/components/Toggle"
import API from "@/lib/API"
import Loading from "@/components/Loading"
import { CheckMarkIcon, WarningIcon } from "../Icons"

export default function UpdateThemeForm() {
    const [theme, setTheme] = useState<Exclude<Theme, "system">>(Appearance.DEFAULT_THEME)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
    const [loading, setLoading] = useState(false)
    const [deviceSettings, setDeviceSettings] = useState(true)

    useEffect(() => {
        if (user) {
            setDeviceSettings(user.preferences.theme === "system")
            if (user.preferences.theme !== "system") setTheme(user.preferences.theme)
        }
    }, [user])

    const handleSubmit = () => {
        if (cookies.token) {
            setLoading(true)
            API.put<{ theme: Theme }>(`/api/v1/users/${user!.id}/preferences/theme`, {
                theme: deviceSettings ? "system" : theme
            }, true).then(data => {
                setLoading(false)
                const newUser = { ...user! }
                newUser.preferences.theme = data.theme
                setUser(newUser)
                setAlert({
                    label: "Updated",
                    icon: <CheckMarkIcon />,
                    message: "Theme Updated Successfully",
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
                <Fieldset label="Theme">
                    <LabelField fieldset label="Device Settings">
                        <Toggle on={deviceSettings} onChange={(val) => setDeviceSettings(val)} />
                    </LabelField>
                    {!deviceSettings ? (
                        <ThemePicker fieldset value={theme} onChange={(val) => setTheme(val)} />
                    ) : null}
                </Fieldset>
                <Button label="Update Theme" />
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