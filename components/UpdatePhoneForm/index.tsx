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
import { CheckMarkIcon, WarningIcon } from "../Icons"

export default function UpdatePhoneForm() {
    const [phone, setPhone] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alert, setAlert] = useState({ label: "", icon: <></>, message: "", open: false })
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
                setAlert({
                    label: "Updated",
                    icon: <CheckMarkIcon />,
                    message: "Phone Number Updated Successfully",
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
                <PhoneInput placeholder="Phone Number..." value={phone} onChange={(val) => setPhone(val)} />
                <Button
                    label="Update Phone Number"
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