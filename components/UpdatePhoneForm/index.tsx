"use client"
import Form from "@/components/Form"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Validation from "@/lib/Validation"
import PhoneInput from "@/components/PhoneInput"
import User from "@/types/User"
import Loading from "@/components/Loading"
import API from "@/lib/API"

export default function UpdatePhoneForm() {
    const [phone, setPhone] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [loading, setLoading] = useState(false)

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
            setLoading(true)
            API.put<{ phone: User["phone"]}>(`/api/v1/users/${user!.id}/phone`, {
                phone
            }, true).then(data => {
                setLoading(false)
                const newUser = { ...user! }
                newUser.phone = data.phone
                setUser(newUser)

                setAlertMessage("Phone Number Updated Successfully")
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
                <PhoneInput placeholder="Phone Number..." value={phone} onChange={(val) => setPhone(val)} />
                <Button
                    label="Update Phone Number"
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