"use client"
import styles from "./DaySelect.module.css"

type BaseProps = {
    fieldset?: boolean
}

type SingleProps = BaseProps & {
    multiple?: false,
    value: number,
    onChange: (value: number) => void
}

type MultipleProps = BaseProps & {
    multiple: true,
    value: number[],
    onChange: (value: number[]) => void
}

type DaySelectProps = SingleProps | MultipleProps

export default function DaySelect(props: DaySelectProps) {
    const handleClick = (value: number) => {
        if (props.multiple) {
            if (props.value.includes(value)) {
                props.onChange(props.value.filter(value2 => value2 !== value))
            } else {
                props.onChange([ ...props.value, value ])
            }
        } else {
            props.onChange(value)
        }
    }

    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <ul className={styles.lstOptions}>
                {Array.from({ length: 31 }).map((_, i) => {
                    const value = i + 1
                    const selected = props.multiple ? props.value.includes(value) : value === props.value
                    return (
                        <li key={i}>
                            <button
                                type="button"
                                className={`${styles.btnOption} ${selected ? styles.selected : ""}`}
                                onClick={() => handleClick(value)}
                            >
                                {value}
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}