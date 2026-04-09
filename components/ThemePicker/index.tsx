"use client"
import { ReactElement } from "react"
import styles from "./ThemePicker.module.css"
import Theme from "@/types/Theme"
import { MoonIcon, SunIcon } from "../Icons"

type ThemePickerProps = {
    fieldset?: boolean,
    value: Theme,
    onChange: (value: Theme) => void
}

export default function ThemePicker(props: ThemePickerProps) {
    const options: {
        value: Theme,
        icon: ReactElement<SVGElement>,
        label: string
    }[] = [
        { value: "light", icon: <SunIcon />, label: "Light" },
        { value: "dark", icon: <MoonIcon />, label: "Dark" }
    ]
    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <ul className={styles.lst}>
                {options.map((option, i) => {
                    const selected = option.value === props.value
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                className={`${styles.btn} ${selected ? styles.selected : ""}`}
                                onClick={() => props.onChange(option.value)}
                            >
                                {option.icon}
                                <span className={styles.label}>{option.label}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}