import styles from "./DateCard.module.css"
import { useState, useEffect } from "react"
import Utility from "@/lib/Utility"

export default function DateCard() {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={styles.background}>
            <p className={styles.date}>{Utility.formatDate(now, true)}</p>
            <p className={styles.time}>{Utility.formatTime(now)}</p>
        </div>
    )
}