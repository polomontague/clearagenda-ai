"use client"
import styles from "./Confirm.module.css"
import Button from "../Button"
import SecondaryButton from "../SecondaryButton"
import { ReactElement } from "react"

type ConfirmProps = {
    label: string,
    icon: ReactElement<SVGElement>,
    message: string,
    open: boolean,
    onRequestCancel: () => void,
    onRequestConfirm: () => void
}

export default function Confirm({ label, icon, message, open, onRequestCancel, onRequestConfirm }: ConfirmProps) {
    return (
        <div className={`${styles.overlay} ${open ? styles.open : styles.closed}`}>
            <div className={styles.window}>
                <header className={styles.header}>
                    <p className={styles.label}>{label}</p>
                </header>
                <div className={styles.containerContent}>
                    <div className={styles.containerIcon}>
                        <div>
                            {icon}
                        </div>
                    </div>
                    <p className={styles.msg}>
                        {message}
                    </p>
                    <div className={styles.frameBtns}>
                        <SecondaryButton label="Cancel" onClick={onRequestCancel} />
                        <Button label="Confirm" onClick={onRequestConfirm} />
                    </div>
                </div>
            </div>
        </div>
    )
}