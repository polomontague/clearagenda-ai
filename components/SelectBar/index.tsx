"use client"
import styles from "./SelectBar.module.css"

type SelectBarOption = {
    value: string,
    label: string
}

type SelectBarProps = {
    options: SelectBarOption[]
    value: string,
    onChange: (value: string) => void
}

export default function SelectBar(props: SelectBarProps) {
    return (
        <div className={styles.background}>
            <ul className={styles.lstOptions}>
                {props.options.map((option, i) => {
                    const selected = option.value === props.value
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                className={`${styles.btn} ${selected ? styles.selected : ""}`}
                                onClick={() => props.onChange(option.value)}
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