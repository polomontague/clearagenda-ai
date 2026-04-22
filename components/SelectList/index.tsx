"use client"
import styles from "./SelectList.module.css"
import { CheckMarkIcon } from "@/components/Icons"

type Option<Value> = {
    value: Value,
    label: string
}

type SelectListProps<Value> = {
    fieldset?: boolean,
    options: Option<Value>[],
    value: Value[],
    onChange: (value: Value[]) => void
}

export default function SelectList<Value>(props: SelectListProps<Value>) {
    const handleClick = (option: Option<Value>) => {
        if (props.value.includes(option.value)) {
            props.onChange(props.value.filter(value => value !== option.value))
        } else {
            props.onChange([ ...props.value, option.value ])
        }
    }

    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <ul className={styles.lstOptions}>
                {props.options.map((option, i) => {
                    const selected = props.value.includes(option.value)
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                className={`${styles.option} ${selected ? styles.selected : ""}`}
                                onClick={() => handleClick(option)}
                            >
                                <span className={styles.label}>{option.label}</span>
                                <div className={styles.containerIcon}>
                                    <CheckMarkIcon />
                                </div>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}