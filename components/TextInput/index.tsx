"use client"
import { KeyboardEvent } from "react"
import styles from "./TextInput.module.css"

type TextInputProps = {
    fieldset?: boolean,
    placeholder: string,
    value: string,
    onChange: (value: string) => void,
    onEnter?: () => void
}

const TextInput = (props: TextInputProps) => {
    const handleKeyDown = (evt: KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter" && props.onEnter) {
            evt.preventDefault()
            props.onEnter()
        }
    }

    return (
        <div className={`${styles.input} ${props.fieldset ? styles.fieldset : ""}`}>
            <input
                type="text"
                placeholder={props.placeholder}
                value={props.value}
                onChange={(evt) => props.onChange(evt.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}

export default TextInput