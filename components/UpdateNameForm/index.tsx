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
import Fieldset from "@/components/Fieldset"

export default function UpdateNameForm() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [submitDisabled, setSubmitDisabled] = useState(true)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setFirstName(user.name.first)
            setLastName(user.name.last)
        }
    }, [user])

    useEffect(() => {
        setSubmitDisabled(!validate())
    }, [firstName, lastName])

    const validate = () => {
        let valid = true
        if (!firstName) valid = false
        if (!lastName) valid = false
        return valid
    }

    const handleSubmit = () => {
        if (cookies.token) {
            setSubmitLoading(true)
            axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/${user!.id}/name`, {
                first: firstName,
                last: lastName
            }, {
                headers: {
                    Authorization: cookies.token ? `Bearer ${cookies.token}` : undefined
                }
            }).then(res => {
                setSubmitLoading(false)
                const newUser = { ...user! }
                newUser.name = res.data.data.name
                setUser(newUser)

                setAlertMessage("Name Updated Successfully")
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
                <Fieldset label="Name">
                    <TextInput fieldset placeholder="First Name..." value={firstName} onChange={(val) => setFirstName(val)} />
                    <TextInput fieldset placeholder="Last Name..." value={lastName} onChange={(val) => setLastName(val)} />
                </Fieldset>
                <Button
                    label="Update Name"
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