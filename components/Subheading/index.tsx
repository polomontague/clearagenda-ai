import styles from "./Subheading.module.css"
import { ReactNode } from "react"

type SubheadingProps = {
    margin?: boolean,
    children: ReactNode
}

export default function Subheading({ margin = false, children }: SubheadingProps) {
    return (
        <h2 className={`${styles.subheading} ${margin ? styles.margin : ""}`}>{children}</h2>
    )
}