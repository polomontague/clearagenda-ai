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
import { WarningIcon } from "../Icons"

export default function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
    const [loading, setLoading] = useState(false)
    const { setUser } = useContext(UserContext)
    const router = useRouter()
    const [cookies, setCookie] = useCookies()

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [username, password])

    const validate = () => {
        let valid = true
        if (!Validation.email(username) && !Validation.phone(username)) valid = false
        if (!Validation.password(password)) valid = false
        return valid
    }

    const handleSubmit = () => {
        setLoading(true)
        API.post<{ user: User, token: string, type: string, expires: number }>("/api/v1/login", {
            username,
            password
        }).then(data => {
            setLoading(false)
            setUser(data.user)
            setCookie("token", data.token, {
                path: "/",
                expires: new Date(new Date().getTime() + (data.expires * 1000)),
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                httpOnly: false,
            })
            router.push(Routes.AUTH_LANDING_PAGE)
        }).catch(err => {
            setLoading(false)
            setAlert({
                label: "Error",
                icon: <WarningIcon />,
                message: err.message,
                open: true
            })
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <TextInput placeholder="Email or Phone..." value={username} onChange={(val) => setUsername(val)} />
                <PasswordInput placeholder="Password..." value={password} onChange={(val) => setPassword(val)} />
                <Button
                    label="Login"
                    description={<>By logging in, you agree to ClearAgenda AI's <Link href="/terms-of-service" label="Terms of Service" /> and <Link href="/privacy-policy" label="Privacy Policy" /></>}
                    disabled={submitDisabled}
                />
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