"use client"
import styles from "./PasswordInput.module.css"
import { useState } from "react"

type PasswordInputProps = {
    fieldset?: boolean,
    create?: boolean,
    placeholder: string,
    value: string,
    onChange: (value: string) => void
}

const PasswordInput = (props: PasswordInputProps) => {
    const [isShow, setIsShow] = useState(false)

    return (
        <div className={`${styles.inputPassword} ${props.fieldset ? styles.fieldset : ""}`}>
            <input
                type={isShow ? "text" : "password"}
                name="password"
                autoComplete={props.create ? "new-password" : "current-password"}
                placeholder={props.placeholder}
                value={props.value}
                onChange={(evt) => props.onChange(evt.target.value)}
            />
            <button
                type="button"
                onClick={() => setIsShow(!isShow)}
            >
                {isShow ? "Hide" : "Show"}
            </button>
        </div>
    )
}

export default PasswordInput