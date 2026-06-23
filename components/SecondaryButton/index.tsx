"use client"
import styles from "./SecondaryButton.module.css"
import { ReactElement } from "react"

type SecondaryButtonProps = {
    layer?: 2 | 3,
    narrow?: boolean,
    label: string,
    description?: string | ReactElement,
    onClick: () => void
}

export default function SecondaryButton({ layer = 3, narrow, label, description, onClick }: SecondaryButtonProps) {
    return (
        <div className={`${styles.background} ${layer ? styles[`layer${layer}`] : ""} ${narrow ? styles.narrow : styles.wide}`}>
            <button
                type="button"
                className={styles.btn}
                onClick={() => onClick()}
            >
                {label}
            </button>
            {description ? (
                <p className={styles.description}>{description}</p>
            ) : null}
        </div>
    )
}