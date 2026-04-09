"use client"
import Form from "@/components/Form"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import axios from "axios"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Validation from "@/lib/Validation"
import PhoneInput from "@/components/PhoneInput"

export default function UpdatePhoneForm() {
    const [phone, setPhone] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setPhone(user.phone)
        }
    }, [user])

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [phone])

    const validate = () => {
        let valid = true
        if (!Validation.phone(phone)) valid = false
        return valid
    }

    const handleSubmit = () => {
        if (cookies.token) {
            setSubmitLoading(true)
            axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${user!.id}/phone`, {
                phone
            }, {
                headers: {
                    Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
                }
            }).then(res => {
                setSubmitLoading(false)
                const newUser = { ...user! }
                newUser.phone = res.data.data.phone
                setUser(newUser)

                setAlertMessage("Phone Number Updated Successfully")
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
                <PhoneInput placeholder="Phone Number..." value={phone} onChange={(val) => setPhone(val)} />
                <Button
                    label="Update Phone Number"
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