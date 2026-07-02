"use client"
import Form from "@/components/Form"
import TextInput from "@/components/TextInput"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import User from "@/types/User"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Validation from "@/lib/Validation"
import Loading from "@/components/Loading"
import API from "@/lib/API"
import { CheckMarkIcon, WarningIcon } from "../Icons"

export default function UpdateEmailForm() {
    const [email, setEmail] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setEmail(user.email)
        }
    }, [user])

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [email])

    const validate = () => {
        let valid = true
        if (!Validation.email(email)) valid = false
        return valid
    }

    const handleSubmit = () => {
        if (cookies.token) {
            setLoading(true)
            API.put<{ email: User["email"]}>(`/api/v1/users/${user!.id}/email`, {
                email
            }, true).then(data => {
                setLoading(false)
                const newUser = { ...user! }
                newUser.email = data.email
                setUser(newUser)
                setAlert({
                    label: "Updated",
                    icon: <CheckMarkIcon />,
                    message: "Email Updated Successfully",
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
                <TextInput placeholder="Email..." value={email} onChange={(val) => setEmail(val)} />
                <Button
                    label="Update Email"
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