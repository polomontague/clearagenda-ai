import styles from "./Heading.module.css"
import { ReactNode } from "react"

type HeadingProps = {
    children: ReactNode
}

export default function Heading({ children }: HeadingProps) {
    return (
        <h1 className={styles.heading}>{children}</h1>
    )
}