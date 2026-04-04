"use client"
import styles from "./TextInput.module.css"

type TextInputProps = {
    fieldset?: boolean,
    placeholder: string,
    value: string,
    onChange: (value: string) => void
}

const TextInput = (props: TextInputProps) => {
    return (
        <div className={`${styles.input} ${props.fieldset ? styles.fieldset : ""}`}>
            <input type="text" placeholder={props.placeholder} value={props.value} onChange={(evt) => props.onChange(evt.target.value)} />
        </div>
    )
}

export default TextInput