import styles from "./Heading.module.css"
import { ReactNode } from "react"

type HeadingProps = {
    margin?: boolean
    children: ReactNode
}

export default function Heading({ margin = false, children }: HeadingProps) {
    return (
        <h1 className={`${styles.heading} ${margin ? styles.margin : ""}`}>{children}</h1>
    )
}