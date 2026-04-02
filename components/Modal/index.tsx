"use client"
import { ReactNode } from "react"
import styles from "./Modal.module.css"

type ModalProps = {
    open: boolean,
    label: string,
    onRequestCancel: () => void,
    onRequestDone: () => void,
    children: ReactNode
}

export default function Modal(props: ModalProps) {
    return (
        <div className={`${styles.overlay} ${props.open ? styles.open : styles.closed}`}>
            <div className={styles.window}>
                <header className={styles.header}>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={() => props.onRequestCancel()}
                    >Cancel</button>
                    <p className={styles.label}>{props.label}</p>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={() => props.onRequestDone()}
                    >Done</button>
                </header>
                <div className={styles.containerScroll}>
                    <div className={styles.containerChildren}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}