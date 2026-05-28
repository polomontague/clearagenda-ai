import styles from "./LinkButton.module.css"
import Link from "next/link"

type LinkButtonProps = {
    narrow?: boolean,
    href: string,
    label: string
}

export default function LinkButton(props: LinkButtonProps) {
    return (
        <Link
            className={`${styles.btn} ${props.narrow ? styles.narrow : styles.wide}`}
            href={props.href}
        >
            {props.label}
        </Link>
    )
}