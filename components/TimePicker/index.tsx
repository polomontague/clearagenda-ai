"use client"
import MultiSelect from "@/components/MultiSelect"

type TimePickerProps = {
    fieldset?: boolean,
    value: Date,
    onChange: (value: Date) => void
}

export default function TimePicker(props: TimePickerProps) {
    const handleChange = (val: {
        hour: number,
        minute: number,
        am_or_pm: "am" | "pm"
    }) => {
        const newValue = new Date(props.value)
        newValue.setHours(val.am_or_pm === "am" ? val.hour : val.hour + 12)
        newValue.setMinutes(val.minute)
        props.onChange(newValue)
    }

    return (
        <MultiSelect
            fieldset={props.fieldset}
            options={{
                hour: Array.from({ length: 12 }).map((_, i) => ({ value: i + 1, label: (i + 1).toString() })),
                minute: Array.from({ length: 12 }).map((_, i) => ({ value: i * 5, label: (i * 5).toString().padStart(2, "0") })),
                am_or_pm: [
                    { value: "am", label: "AM" },
                    { value: "pm", label: "PM" }
                ]
            }}
            value={{
                hour: props.value.getHours() % 12,
                minute: props.value.getMinutes(),
                am_or_pm: props.value.getHours() < 12 ? "am" : "pm"
            }}
            onChange={handleChange}
        />
    )
}