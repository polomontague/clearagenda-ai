"use client"
import Form from "@/components/Form"
import RangeInput from "@/components/RangeInput"
import FieldFrame from "@/components/FieldFrame"
import { useState, useEffect, useContext } from "react"
import Button from "@/components/Button"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import UserContext from "@/contexts/UserContext"
import Alert from "@/components/Alert"
import Fieldset from "@/components/Fieldset"
import LabelField from "@/components/LabelField"
import InnerValue from "@/components/InnerValue"
import Loading from "@/components/Loading"
import API from "@/lib/API"
import User from "@/types/User"

export default function UpdatePreferencesHoursForm() {
    const [sunday, setSunday] = useState(0)
    const [monday, setMonday] = useState(8)
    const [tuesday, setTuesday] = useState(8)
    const [wednesday, setWednesday] = useState(8)
    const [thursday, setThursday] = useState(8)
    const [friday, setFriday] = useState(8)
    const [saturday, setSaturday] = useState(0)
    const [cookies] = useCookies()
    const router = useRouter()
    const { user, setUser } = useContext(UserContext)
    const [alertMessage, setAlertMessage] = useState("")
    const [alertOpen, setAlertOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (user) {
            setSunday(user.preferences.hours.sunday)
            setMonday(user.preferences.hours.monday)
            setTuesday(user.preferences.hours.tuesday)
            setWednesday(user.preferences.hours.wednesday)
            setThursday(user.preferences.hours.thursday)
            setFriday(user.preferences.hours.friday)
            setSaturday(user.preferences.hours.saturday)
        }
    }, [user])

    const handleSubmit = () => {
        if (cookies.token) {
            setLoading(true)
            API.put<{ hours: User["preferences"]["hours"] }>(`/api/v1/users/${user!.id}/preferences/hours`, {
                sunday,
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday
            }, true).then(data => {
                setLoading(false)
                const newUser = { ...user! }
                newUser.preferences.hours = data.hours
                setUser(newUser)

                setAlertMessage("Hours Updated Successfully")
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
                <Fieldset label="Sunday">
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${sunday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={sunday} onChange={(val) => setSunday(val)} />
                </Fieldset>
                <Fieldset label="Monday">
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${monday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={monday} onChange={(val) => setMonday(val)} />
                </Fieldset>
                <Fieldset label="Tuesday">
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${tuesday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={tuesday} onChange={(val) => setTuesday(val)} />
                </Fieldset>
                <Fieldset label="Wednesday">
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${wednesday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={wednesday} onChange={(val) => setWednesday(val)} />
                </Fieldset>
                <Fieldset label="Thursday">
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${thursday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={thursday} onChange={(val) => setThursday(val)} />
                </Fieldset>
                <Fieldset label="Friday">
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${friday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={friday} onChange={(val) => setFriday(val)} />
                </Fieldset>
                <Fieldset
                    label="Saturday"
                    description="Number of hours per day that you want your daily agenda to fill"
                >
                    <LabelField fieldset label="Hours">
                        <InnerValue label={`${saturday} Hrs`} />
                    </LabelField>
                    <RangeInput fieldset min={0} max={24} step={1} value={saturday} onChange={(val) => setSaturday(val)} />
                </Fieldset>
                <Button label="Update Hours" />
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