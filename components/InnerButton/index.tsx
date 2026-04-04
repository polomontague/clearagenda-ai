import { ReactElement } from "react"
import styles from "./InnerButton.module.css"

type InnerButtonProps = {
    icon?: ReactElement<SVGElement>,
    label: string
}

export default function InnerButton(props: InnerButtonProps) {
    return (
        <button
            type="button"
            className={styles.btn}
        >
            {props.icon}
            <span className={styles.label}>{props.label}</span>
        </button>
    )
}