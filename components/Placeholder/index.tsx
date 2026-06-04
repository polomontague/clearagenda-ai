import styles from "./Placeholder.module.css"
import { ReactElement } from "react"

type PlaceholderProps = {
    layer?: 2 | 3,
    icon: ReactElement<SVGElement>,
    label: string
}

export default function Placeholder({ layer = 3, icon, label }: PlaceholderProps) {
    return (
        <div className={`${styles.container} ${styles[`layer${layer}`]}`}>
            {icon}
            <span className={styles.label}>{label}</span>
        </div>
    )
}