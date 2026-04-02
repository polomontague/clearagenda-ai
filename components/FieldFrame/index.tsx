import styles from "./FieldFrame.module.css"
import { ReactElement } from "react"

type FieldFrameProps = {
    children: ReactElement | ReactElement[]
}

export default function FieldFrame(props: FieldFrameProps) {
    return (
        <div className={styles.frame}>
            {props.children}
        </div>
    )
}