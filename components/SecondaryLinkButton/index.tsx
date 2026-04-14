import styles from "./SecondaryLinkButton.module.css"
import Link from "next/link"

type SecondaryLinkButtonProps = {
    fieldset?: boolean,
    href: string,
    label: string
}

export default function SecondaryLinkButton(props: SecondaryLinkButtonProps) {
    return (
        <Link
            className={`${styles.btn} ${props.fieldset ? styles.fieldset : ""}`}
            href={props.href}
        >
            {props.label}
        </Link>
    )
}