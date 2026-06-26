"use client"
import styles from "./Confirm.module.css"
import { useEffect } from "react"

const Confirm = (props: {
    message: string,
    open: boolean,
    onRequestCancel: () => void,
    onRequestConfirm: () => void
}) => {
    useEffect(() => {
        document.documentElement.style.overflow = props.open ? "hidden" : "scroll"
    }, [props.open])

    return (
        <div className={`${styles.overlay} ${props.open ? styles.open : styles.closed}`}>
            <div className={styles.confirm}>
                <p className={styles.msg}>{props.message}</p>
                <div className={styles.containerBtns}>
                    <button onClick={() => props.onRequestCancel()}>Cancel</button>
                    <button onClick={() => props.onRequestConfirm()}>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default Confirm