"use client"
import Form from "@/components/Form"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import axios from "axios"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import Alert from "@/components/Alert"
import Validation from "@/lib/Validation"
import PasswordInput from "@/components/PasswordInput"
import UserContext from "@/contexts/UserContext"
import Fieldset from "@/components/Fieldset"

export default function UpdatePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmNewPassword, setConfirmNewPassword] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
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
            setSubmitLoading(true)
            axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${user!.id}/password`, {
                current_password: currentPassword,
                new_password: newPassword
            }, {
                headers: {
                    Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
                }
            }).then(res => {
                setSubmitLoading(false)

                setAlertMessage("Password Changed Successfully")
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
                <PasswordInput placeholder="Current Password..." value={currentPassword} onChange={(val) => setCurrentPassword(val)} />
                <Fieldset label="New Password">
                    <PasswordInput fieldset create placeholder="New Password..." value={newPassword} onChange={(val) => setNewPassword(val)} />
                    <PasswordInput fieldset placeholder="Confirm Password..." value={confirmNewPassword} onChange={(val) => setConfirmNewPassword(val)} />
                </Fieldset>
                <Button
                    label="Change Password"
                    disabled={submitDisabled}
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