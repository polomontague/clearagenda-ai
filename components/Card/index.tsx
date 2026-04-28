import styles from "./Card.module.css"
import { ReactElement, ReactNode } from "react"
import { CheckMarkIcon, LockIcon } from "@/components/Icons"
import IconButton from "@/components/IconButton"

type Button = {
    icon: ReactElement<SVGElement>,
    disabled?: boolean,
    onClick: () => void
}

type CardProps = {
    fieldset?: boolean,
    locked?: boolean,
    completed?: boolean,
    label: string,
    buttons?: Button[]
    children: ReactNode
}
export default function Card(props: CardProps) {
    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""} ${props.locked ? styles.locked : styles.unlocked} ${props.completed ? styles.completed : styles.incomplete}`}>
            <header className={styles.header}>
                <div className={styles.containerLabel}>
                    <h6
                        className={styles.label}
                        title={props.label}
                    >{props.label}</h6>
                    <div className={styles.fade}></div>
                </div>
                {props.buttons ? (
                    <div className={styles.containerBtns}>
                        {props.buttons.map((button, i) => (
                            <IconButton
                                key={i}
                                icon={button.icon}
                                disabled={button.disabled}
                                onClick={button.onClick}
                            />
                        ))}
                    </div>
                ) : null}
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