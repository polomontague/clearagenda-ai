"use client"
import Form from "@/components/Form"
import TextInput from "@/components/TextInput"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import axios from "axios"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Validation from "@/lib/Validation"

export default function UpdateEmailForm() {
    const [email, setEmail] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

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
            setSubmitLoading(true)
            axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${user!.id}/email`, {
                email
            }, {
                headers: {
                    Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
                }
            }).then(res => {
                setSubmitLoading(false)
                const newUser = { ...user! }
                newUser.email = res.data.data.email
                setUser(newUser)

                setAlertMessage("Email Updated Successfully")
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
                <TextInput placeholder="Email..." value={email} onChange={(val) => setEmail(val)} />
                <Button
                    label="Update Email"
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