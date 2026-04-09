"use client"
import styles from "./Alert.module.css"
import { useEffect } from "react"

const Alert = (props: {
    message: string,
    open: boolean,
    onRequestClose: () => void
}) => {
    useEffect(() => {
        document.documentElement.style.overflow = props.open ? "hidden" : "scroll"
    }, [props.open])

    return (
        <div className={`${styles.overlay} ${props.open ? styles.open : ""}`}>
            <div className={styles.window}>
                <p className={styles.msg}>{props.message}</p>
                <button
                    type="button"
                    className={styles.btnClose}
                    onClick={props.onRequestClose}
                >Cancel</button>
            </div>
        </div>
    )
}

export default Alert