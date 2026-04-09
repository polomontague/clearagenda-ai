import styles from "./Card.module.css"
import { ReactNode } from "react"
import { CheckMarkIcon, LockIcon } from "@/components/Icons"

type CardProps = {
    fieldset?: boolean,
    locked?: boolean,
    completed?: boolean,
    label: string,
    children: ReactNode
}
export default function Card(props: CardProps) {
    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""} ${props.locked ? styles.locked : styles.unlocked} ${props.completed ? styles.completed : styles.incomplete}`}>
            <header className={styles.header}>
                <h6 className={styles.label}>{props.label}</h6>
                <div className={styles.fade}></div>
            </header>
            <div className={styles.containerChildren}>
                {props.children}
                <div className={styles.overlayCompleted}>
                    <CheckMarkIcon />
                </div>
            </div>
            <div className={styles.overlayLocked}>
                <LockIcon />
            </div>
        </div>
    )
}