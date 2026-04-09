"use client"
import styles from "./PhoneInput.module.css"
import { ChangeEvent } from "react"

type PhoneInputProps = {
    fieldset?: boolean,
    placeholder: string,
    value: string,
    onChange: (value: string) => void
}

export default function PhoneInput(props: PhoneInputProps) {
    const formatPhone = (digits: string) => {
        const country = digits.slice(0, 1)
        const area = digits.slice(1, 4)
        const prefix = digits.slice(4, 7)
        const line = digits.slice(7, 11)

        let formatted = ""
        if (country.length) formatted += `+${country}`
        if (area.length) formatted += ` (${area}`
        if (area.length === 3) formatted += ") "
        if (prefix) formatted += prefix
        if (line) formatted += `-${line}`

        return formatted
    }

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const raw = evt.target.value
        let digits = raw.replace(/[^\d]/g, '')

        // Handle formatting deletion
        if (raw.length < formatPhone(props.value).length) {
            if (raw.replace(/\d/g, "").length < formatPhone(props.value).replace(/\d/g, "").length) {
                digits = digits.slice(0, -1)
            }
        }
        props.onChange(digits.slice(0, 11))
    }

    return (
        <div className={`${styles.input} ${props.fieldset ? styles.fieldset : ""}`}>
            <input type="text" placeholder={props.placeholder} value={formatPhone(props.value)} onChange={handleChange} />
        </div>
    )
}