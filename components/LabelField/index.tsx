import styles from "./LabelField.module.css"
import { ReactNode } from "react"

type LabelFieldProps = {
    fieldset?: boolean,
    strike?: boolean,
    label: string,
    children?: ReactNode
}

export default function LabelField({ fieldset, strike, label, children }: LabelFieldProps) {
    return (
        <div className={`${styles.background} ${fieldset ? styles.fieldset : ""} ${strike ? styles.strike : ""}`}>
            <div className={styles.containerLabel}>
                <h6
                    className={styles.label}
                    title={label}
                >{label}</h6>
                <div className={styles.fade}></div>
            </div>
            {children ? (
                <div className={styles.containerChildren}>
                    {children}
                </div>
            ) : null}
        </div>
    )
}