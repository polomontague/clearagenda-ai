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
        <div className={`${layer === 2 ? styles.layer2 : layer === 3 ? styles.layer3 : ""}`}>
            {label ? (
                <p className={styles.label}>{label.toUpperCase()}</p>
            ) : null}
            <div className={styles.containerChildren}>
                {children}
            </div>
            {description ? (
                <p className={styles.description}>{description}</p>
            ) : null}
        </div>
    )
}