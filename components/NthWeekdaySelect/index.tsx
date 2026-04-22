"use client"
import MultiSelect from "@/components/MultiSelect"

type Value = {
    ordinal: number,
    weekday: number
}

type NthWeekdaySelectProps = {
    fieldset?: boolean,
    value: Value,
    onChange: (value: Value) => void
}

export default function NthWeekdaySelect(props: NthWeekdaySelectProps) {
    return (
        <MultiSelect
            fieldset
            options={{
                ordinal: [
                    { value: 0, label: "First" },
                    { value: 1, label: "Second" },
                    { value: 2, label: "Third" },
                    { value: 3, label: "Fourth" },
                    { value: 4, label: "Fifth" },
                    { value: -2, label: "Second Last" },
                    { value: -1, label: "Last" }
                ],
                weekday: [
                    { value: 0, label: "Sunday" },
                    { value: 1, label: "Monday" },
                    { value: 2, label: "Tuesday" },
                    { value: 3, label: "Wednesday" },
                    { value: 4, label: "Thursday" },
                    { value: 5, label: "Friday" },
                    { value: 6, label: "Saturday" }
                ]
            }}
            value={props.value}
            onChange={props.onChange}
        />
    )
}