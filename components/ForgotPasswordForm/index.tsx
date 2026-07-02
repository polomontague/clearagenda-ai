"use client"
import { useState, useEffect } from "react"
import Form from "@/components/Form"
import TextInput from "@/components/TextInput"
import FieldFrame from "@/components/FieldFrame"
import Button from "@/components/Button"
import Validation from "@/lib/Validation"
import Alert from "@/components/Alert"
import Loading from "@/components/Loading"
import API from "@/lib/API"
import Fieldset from "@/components/Fieldset"
import { EnvelopeIcon, WarningIcon } from "../Icons"

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [email])

    const validate = () => {
        let valid = true
        if (!Validation.email(email)) valid = false
        return valid
    }

    const handleSubmit = () => {
        setLoading(true)
        API.post("/api/v1/forgot-password", {
            email
        }).then(() => {
            setLoading(false)
            setEmail("")
            setAlert({
                label: "Check Your Email",
                icon: <EnvelopeIcon />,
                message: "Password Reset Link Sent if Email is Linked to an Account",
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
    }

    return (
        <Form onSubmit={handleSubmit}>
            <FieldFrame>
                <Fieldset
                    description="Enter the email associated with your account"
                >
                    <TextInput fieldset placeholder="Email..." value={email} onChange={(val) => setEmail(val)} />
                </Fieldset>
                <Button
                    label="Send Reset Link"
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