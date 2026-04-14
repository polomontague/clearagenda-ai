"use client"
import styles from "./SelectBar.module.css"

export type SelectBarOption = {
    value: string,
    label: string
}

type SelectBarProps = {
    layer?: 2 | 3,
    fieldset?: boolean,
    options: SelectBarOption[]
    value: string,
    onChange: (value: string) => void
}

export default function SelectBar({ layer = 3, fieldset, options, value, onChange }: SelectBarProps) {
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