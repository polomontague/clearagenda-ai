import styles from "./LinkButton.module.css"
import Link from "next/link"

type LinkButtonProps = {
    href: string,
    label: string
}

export default function LinkButton(props: LinkButtonProps) {
    return (
        <Link
            className={styles.btn}
            href={props.href}
        >
            {props.label}
        </Link>
    )
}