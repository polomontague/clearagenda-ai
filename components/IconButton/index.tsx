"use client"
import styles from "./IconButton.module.css"
import { ReactElement } from "react"

type IconButtonProps = {
    icon: ReactElement<SVGElement>,
    disabled?: boolean,
    onClick: () => void
}

export default function IconButton(props: IconButtonProps) {
    return (
        <button
            type="button"
            className={styles.btn}
            disabled={props.disabled}
            onClick={() => props.onClick()}
        >
            <div className={styles.containerIcon}>
                {props.icon}
            </div>
        </button>
    )
}