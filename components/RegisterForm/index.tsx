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
import Fieldset from "@/components/Fieldset"
import PhoneInput from "@/components/PhoneInput"
import Link from "@/components/Link"
import Loading from "@/components/Loading"

export default function RegisterForm() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { setUser } = useContext(UserContext)
    const [ cookies, setCookie ] = useCookies()
    const router = useRouter()

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [firstName, lastName, email, phone, password])

    const validate = () => {
        let valid = true
        if (!firstName) valid = false
        if (!lastName) valid = false
        if (!Validation.email(email)) valid = false
        if (!Validation.phone(phone)) valid = false
        if (!Validation.password(password)) valid = false
        if (password !== confirmPassword) valid = false
        return valid
    }

    const handleSubmit = () => {
        setLoading(true)
        axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/register`, {
            name: {
                first: firstName,
                last: lastName
            },
            email,
            phone,
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
            router.push("/set-up")
        }).catch(err => {
            setLoading(false)
            setAlertMessage(err.response.data.error.message)
            setAlertOpen(true)
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset label="Name">
                    <TextInput fieldset placeholder="First Name..." value={firstName} onChange={(val) => setFirstName(val)} />
                    <TextInput fieldset placeholder="Last Name..." value={lastName} onChange={(val) => setLastName(val)} />
                </Fieldset>
                <TextInput placeholder="Email..." value={email} onChange={(val) => setEmail(val)} />
                <PhoneInput placeholder="Phone Number..." value={phone} onChange={(val) => setPhone(val)} />
                <Fieldset label="Password">
                    <PasswordInput fieldset create placeholder="Password..." value={password} onChange={(val) => setPassword(val)} />
                    <PasswordInput fieldset placeholder="Confirm Password..." value={confirmPassword} onChange={(val) => setConfirmPassword(val)} />
                </Fieldset>
                <Button
                    label="Start Free Trial"
                    description={<>By creating an account, you agree to ClearAgenda AI's <Link href="/terms-of-service" label="Terms of Service" /> and <Link href="/privacy-policy" label="Privacy Policy" /></>}
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