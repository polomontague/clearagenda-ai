"use client"
import styles from "./IconButton.module.css"
import { ReactElement } from "react"

type IconButtonProps = {
    icon: ReactElement<SVGElement>,
    onClick: () => void
}

export default function IconButton(props: IconButtonProps) {
    return (
        <button
            type="button"
            className={styles.btn}
            onClick={() => props.onClick()}
        >
            <div className={styles.containerIcon}>
                {props.icon}
            </div>
        </button>
    )
}