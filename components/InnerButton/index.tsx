import { ReactElement } from "react"
import styles from "./InnerButton.module.css"

type InnerButtonProps = {
    icon?: ReactElement<SVGElement>,
    label: string,
    onClick: () => void
}

export default function InnerButton(props: InnerButtonProps) {
    return (
        <button
            type="button"
            className={styles.btn}
            onClick={() => props.onClick()}
        >
            {props.icon}
            <span className={styles.label}>{props.label}</span>
        </button>
    )
}