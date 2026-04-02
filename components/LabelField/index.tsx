import styles from "./LabelField.module.css"
import { ReactNode } from "react"

type LabelFieldProps = {
    fieldset?: boolean,
    label: string,
    children: ReactNode
}

export default function LabelField(props: LabelFieldProps) {
    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <span className={styles.label}>{props.label}</span>
            <div className={styles.containerChildren}>
                {props.children}
            </div>
        </div>
    )
}