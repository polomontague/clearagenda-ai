"use client"
import styles from "./Alert.module.css"
import { ReactElement } from "react"
import Button from "../Button"

type AlertProps = {
    label: string,
    icon: ReactElement<SVGElement>,
    message: string,
    open: boolean,
    onRequestClose: () => void
}

export default function Alert({ label, icon, message, open, onRequestClose }: AlertProps) {
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
                    <Button type="button" label="Close" onClick={onRequestClose} />
                </div>
            </div>
        </div>
    )
}