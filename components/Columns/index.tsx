import styles from "./Columns.module.css"
import { ReactElement } from "react"

type ColumnsProps = {
    left: ReactElement,
    right: ReactElement
}

export default function Columns(props: ColumnsProps) {
    return (
        <div className={styles.frame}>
            <aside className={styles.columnLeft}>
                {props.left}
            </aside>
            <div className={styles.columnRight}>
                {props.right}
            </div>
        </div>
    )
}