import styles from "./Link.module.css"
import NextLink from "next/link"

type LinkProps = {
    href: string,
    label: string
}

export default function Link(props: LinkProps) {
    return (
        <NextLink
            className={styles.link}
            href={props.href}
        >{props.label}</NextLink>
    )
}