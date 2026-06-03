"use client"
import styles from "./SecondaryButton.module.css"

type SecondaryButtonProps = {
    narrow?: boolean,
    label: string,
    onClick: () => void
}

export default function SecondaryButton({ narrow, label, onClick }: SecondaryButtonProps) {
    return (
        <button
            type="button"
            className={`${styles.btn} ${narrow ? styles.narrow : styles.wide}`}
            onClick={() => onClick()}
        >
            {label}
        </button>
    )
}