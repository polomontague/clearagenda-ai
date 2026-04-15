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

export default function UpdateEmailForm() {
    const [email, setEmail] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
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

                setAlertMessage("Email Updated Successfully")
                setAlertOpen(true)
            }).catch(err => {
                setLoading(false)
                setAlertMessage(err.message)
                setAlertOpen(true)
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
                message={alertMessage}
                open={alertOpen}
                onRequestClose={() => setAlertOpen(false)}
            />
            <Loading loading={loading} />
        </Form>
    )
}