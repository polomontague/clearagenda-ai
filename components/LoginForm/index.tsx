"use client"
import { useState, useEffect, useContext } from "react"
import Form from "@/components/Form"
import TextInput from "@/components/TextInput"
import PasswordInput from "@/components/PasswordInput"
import FieldFrame from "@/components/FieldFrame"
import Button from "@/components/Button"
import Validation from "@/lib/Validation"
import axios from "axios"
import Alert from "@/components/Alert"
import UserContext from "@/contexts/UserContext"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"

export default function LoginForm() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setUser } = useContext(UserContext)
    const [ cookies, setCookie ] = useCookies()
    const router = useRouter()

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
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/login`, {
            username,
            password
        }).then(res => {
            setLoading(false)
            setUser(res.data.data.user)
            setCookie("token", res.data.data.token, {
                path: "/",
                expires: new Date(new Date().getTime() + (res.data.data.expires * 1000)),
                sameSite: "strict",
                secure: true,
                httpOnly: false,
            })
            router.push("/agenda")
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.response.data.error.message)
            setAlertOpen(true)
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <TextInput placeholder="Email or Phone..." value={username} onChange={(val) => setUsername(val)} />
                <PasswordInput placeholder="Password..." value={password} onChange={(val) => setPassword(val)} />
                <Button
                    label="Login"
                    disabled={submitDisabled}
                    loading={loading}
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