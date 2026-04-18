"use client"
import styles from "./SquareButton.module.css"
import { ReactElement } from "react"

type SquareButtonProps = {
    icon: ReactElement<SVGElement>,
    onClick: () => void
}

export default function SquareButton(props: SquareButtonProps) {
    return (
        <button
            type="button"
            className={styles.btn}
            onClick={props.onClick}
        >
            {props.icon}
        </button>
    )
}