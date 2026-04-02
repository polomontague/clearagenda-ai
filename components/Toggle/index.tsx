"use client"
import styles from "./Toggle.module.css"

type ToggleProps = {
    on: boolean,
    onChange: (on: boolean) => void
}

export default function Toggle(props: ToggleProps) {
    return (
        <button
            type="button"
            className={`${styles.toggle} ${props.on ? styles.on : styles.off}`}
            onClick={() => props.onChange(!props.on)}
        >
            <div className={styles.dot}></div>
        </button>
    )
}