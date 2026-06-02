import { ReactElement } from "react"
import styles from "./EmptyState.module.css"
import LinkButton from "../LinkButton"
import Button from "../Button"

type Button = {
    type: "button",
    label: string,
    onClick: () => void
}

type Link = {
    type: "link",
    href: string,
    label: string
}

type EmptyStateProps = {
    icon: ReactElement<SVGElement>,
    message: string,
    button: Button | Link
}

export default function EmptyState({ icon, message, button }: EmptyStateProps) {
    return (
        <div className={styles.frame}>
            <p className={styles.containerMsg}>
                {icon}
                <span className={styles.label}>{message}</span>
            </p>
            {button.type === "button" ? (
                <Button label={button.label} onClick={button.onClick} />
            ) : button.type === "link" ? (
                <LinkButton href={button.href} label={button.href} />
            ) : null}
        </div>
    )
}