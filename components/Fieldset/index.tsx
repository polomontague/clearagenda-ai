import styles from "./Fieldset.module.css"
import { ReactNode, ReactElement } from "react"

type FieldsetProps = {
    layer?: 2 | 3,
    label?: string,
    description?: string | ReactElement,
    children: ReactNode
}

export default function Fieldset({ layer = 3, label, description, children }: FieldsetProps) {
    return (
        <div className={`${styles.background} ${styles[`layer${layer}`]}`}>
            {label ? (
                <p className={styles.label}>{label.toUpperCase()}</p>
            ) : null}
            <div className={styles.frame}>
                {children}
            </div>
            {description ? (
                <p className={styles.description}>{description}</p>
            ) : null}
        </div>
    )
}