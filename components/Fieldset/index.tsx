import styles from "./Fieldset.module.css"
import { ReactNode } from "react"

type FieldsetProps = {
    label?: string,
    description?: string,
    children: ReactNode
}

export default function Fieldset(props: FieldsetProps) {
    return (
        <div className={styles.background}>
            {props.label ? (
                <p className={styles.label}>{props.label.toUpperCase()}</p>
            ) : null}
            <div className={styles.frame}>
                {props.children}
            </div>
            {props.description ? (
                <p className={styles.description}>{props.description}</p>
            ) : null}
        </div>
    )
}