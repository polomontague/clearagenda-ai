import styles from "./Paragraph.module.css"
import { ReactNode } from "react"

type ParagraphProps = {
    margin?: boolean,
    children: ReactNode
}

export default function Paragraph({ margin = false, children }: ParagraphProps) {
    return (
        <p className={`${styles.paragraph} ${margin ? styles.margin : ""}`}>{children}</p>
    )
}