"use client"
import Form from "@/components/Form"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import Alert from "@/components/Alert"
import Validation from "@/lib/Validation"
import PasswordInput from "@/components/PasswordInput"
import UserContext from "@/contexts/UserContext"
import Fieldset from "@/components/Fieldset"
import API from "@/lib/API"
import Loading from "@/components/Loading"
import { CheckMarkIcon, WarningIcon } from "../Icons"

export default function UpdatePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
    const [loading, setLoading] = useState(false)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [currentPassword, newPassword, confirmNewPassword])

    const validate = () => {
        let valid = true
        if (!Validation.password(currentPassword)) valid = false
        if (!Validation.password(newPassword)) valid = false
        if (newPassword !== confirmNewPassword) valid = false
        return valid
    }

    const handleSubmit = () => {
        if (cookies.token) {
            setLoading(true)
            API.put(`/api/v1/users/${user?.id}/password`, {
                current_password: currentPassword,
                new_password: newPassword
            }, true).then(() => {
                setLoading(false)
                setCurrentPassword("")
                setNewPassword("")
                setConfirmNewPassword("")
                setAlert({
                    label: "Password Changed",
                    icon: <CheckMarkIcon />,
                    message: "Password Changed Successfully",
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
                <PasswordInput placeholder="Current Password..." value={currentPassword} onChange={(val) => setCurrentPassword(val)} />
                <Fieldset label="New Password">
                    <PasswordInput fieldset create placeholder="New Password..." value={newPassword} onChange={(val) => setNewPassword(val)} />
                    <PasswordInput fieldset placeholder="Confirm Password..." value={confirmNewPassword} onChange={(val) => setConfirmNewPassword(val)} />
                </Fieldset>
                <Button
                    label="Change Password"
                    disabled={submitDisabled}
                />
            </FieldFrame>
            <Alert
                label={alert.label}
                icon={alert.icon}
                message={alert.message}
                open={alert.open}
                onRequestClose={() => setAlert({ ...alert, open: false })}
            />
            <Loading loading={loading} />
        </Form>
    )
}