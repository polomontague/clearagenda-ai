"use client"
import styles from "./SelectBar.module.css"

export type SelectBarOption<T extends string = string> = {
    value: T,
    label: string
}

type SelectBarProps<T extends readonly SelectBarOption[]> = {
    layer?: 2 | 3,
    fieldset?: boolean,
    options: T,
    value: T[number]["value"],
    onChange: (value: T[number]["value"]) => void
}

export default function SelectBar<T extends readonly SelectBarOption[]>({ layer = 3, fieldset, options, value, onChange }: SelectBarProps<T>) {
    return (
        <div className={`${styles.background} ${styles[`layer${layer}`]} ${fieldset ? styles.fieldset : ""}`}>
            <ul className={styles.lstOptions}>
                {options.map((option, i) => {
                    const selected = option.value === value
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                className={`${styles.btn} ${selected ? styles.selected : ""}`}
                                onClick={() => onChange(option.value)}
                            >
                                {option.label}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}