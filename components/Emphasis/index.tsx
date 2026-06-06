import styles from "./Emphasis.module.css"
import { ReactNode } from "react"

type EmphasisProps = {
    children: ReactNode
}

export default function Emphasis({ children }: EmphasisProps) {
    return (
        <b className={styles.emphasis}>{children}</b>
    )
}