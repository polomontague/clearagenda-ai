"use client"
import { useState, useEffect, useContext } from "react"
import Form from "@/components/Form"
import TextInput from "@/components/TextInput"
import PasswordInput from "@/components/PasswordInput"
import FieldFrame from "@/components/FieldFrame"
import Button from "@/components/Button"
import Validation from "@/lib/Validation"
import Alert from "@/components/Alert"
import UserContext from "@/contexts/UserContext"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import Fieldset from "@/components/Fieldset"
import Link from "@/components/Link"
import Loading from "@/components/Loading"
import API from "@/lib/API"
import User from "@/types/User"
import Routes from "@/constants/Routes"

export default function ResetPasswordForm() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setUser } = useContext(UserContext)
    const router = useRouter()
    const [cookies, setCookie] = useCookies()

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [password, confirmPassword])

    const validate = () => {
        let valid = true
        if (!Validation.password(password)) valid = false
        if (password !== confirmPassword) valid = false
        return valid
    }

    const handleSubmit = () => {
        setLoading(true)
        API.post<{ user: User, token: string, type: string, expires: number }>("/api/v1/reset-password", {
            password
        }, true).then(data => {
            setLoading(false)
            setUser(data.user)
            setCookie("token", data.token, {
                path: "/",
                expires: new Date(new Date().getTime() + (data.expires * 1000)),
                sameSite: "strict",
                secure: true,
                httpOnly: false,
            })
            router.push(Routes.AUTH_LANDING_PAGE)
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.message)
            setAlertOpen(true)
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset label="Password">
                    <PasswordInput fieldset create placeholder="Password..." value={password} onChange={(val) => setPassword(val)} />
                    <PasswordInput fieldset placeholder="Confirm Password..." value={confirmPassword} onChange={(val) => setConfirmPassword(val)} />
                </Fieldset>
                <Button
                    label="Reset Password"
                    disabled={submitDisabled}
                />
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