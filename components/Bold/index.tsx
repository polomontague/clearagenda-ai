import styles from "./Bold.module.css"
import { ReactNode } from "react"

type BoldProps = {
    children: ReactNode
}

export default function Bold({ children }: BoldProps) {
    return (
        <b className={styles.bold}>{children}</b>
    )
}