"use client"
import SelectList from "@/components/SelectList"
import Fieldset from "@/components/Fieldset"
import Utility from "@/lib/Utility"
import Collapses, { Collapse } from "@/components/Collapses"
import { useState, useMemo } from "react"
import MultiSelect from "@/components/MultiSelect"

type DurationSelectProps = {
    value: number,
    onChange: (value: number) => void
}

export default function DurationSelect(props: DurationSelectProps) {
    const durations = [ 15, 30, 45, 60, 90 ]
    const [open, setOpen] = useState<string>()
    const key = useMemo(() => Math.random().toString(), [])

    const handleListChange = (val: number) => {
        setOpen(undefined)
        if (val >= 0) {
            props.onChange(val)
        } else {
            setOpen(key)
        }
    }

    const handleCustomChange = (val: {
        days: number,
        hours: number,
        minutes: number
    }) => {
        let minutes = 0
        minutes += val.days * (60 * 24)
        minutes += val.hours * 60
        minutes += val.minutes
        props.onChange(minutes)
    }

    return (
        <Collapses value={open}>
            <Fieldset>
                <SelectList
                    fieldset
                    options={[
                        ...durations.map(duration => ({
                            value: duration,
                            label: Utility.formatDuration(duration)
                        })),
                        { value: -1, label: "Custom" }
                    ]}
                    value={props.value}
                    onChange={handleListChange}
                />
                <Collapse value={key}>
                    <MultiSelect
                        fieldset
                        options={{
                            days: Array.from({ length: 101 }).map((_, i) => ({
                                value: i,
                                label: `${i.toString()} ${i === 1 ? "Day" : "Days"}`
                            })),
                            hours: Array.from({ length: 24 }).map((_, i) => ({
                                value: i,
                                label: `${i.toString()} ${i === 1 ? "Hr" : "Hrs"}`
                            })),
                            minutes: Array.from({ length: 12 }).map((_, i) => ({
                                value: i * 5,
                                label: `${(i * 5).toString().padStart(2, "0")} ${i === 1 ? "Min" : "Mins"}`
                            }))
                        }}
                        value={{
                            days: Math.floor(props.value / (60 * 24)),
                            hours: Math.floor((props.value % (60 * 24)) / 60),
                            minutes: props.value % 60
                        }}
                        onChange={handleCustomChange}
                    />
                </Collapse>
            </Fieldset>
        </Collapses>
    )
}