"use client"
import { ReactNode, useEffect } from "react"
import styles from "./Modal.module.css"

type ModalProps = {
    label: string,
    open: boolean,
    onRequestClose: () => void,
    children: ReactNode
}

export default function Modal(props: ModalProps) {
    useEffect(() => {
        document.documentElement.style.overflow = props.open ? "hidden" : "scroll"
    }, [props.open])

    return (
        <div className={`${styles.overlay} ${props.open ? styles.open : styles.closed}`}>
            <div className={styles.window}>
                <div className={styles.containerScroll}>
                    <div className={styles.containerChildren}>
                        {props.children}
                    </div>
                </div>
                <header className={styles.header}>
                    <h6 className={styles.label}>{props.label}</h6>
                    <button
                        type="button"
                        className={styles.btnClose}
                        onClick={() => props.onRequestClose()}
                    >
                        <div className={styles.fade}></div>
                        Close
                    </button>
                </header>
            </div>
        </div>
    )
}