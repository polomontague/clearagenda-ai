import styles from "./LinkBar.module.css"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

export type Option = {
    href: string,
    label: string
}

type LinkBarProps = {
    options: Option[]
}

export default function LinkBar(props: LinkBarProps) {
    const pathname = usePathname()

    return (
        <div className={styles.background}>
            <ul className={styles.lstOptions}>
                {props.options.map((option, i) => {
                    const selected = option.href === pathname
                    return (
                        <li key={i}>
                            <NextLink
                                className={`${styles.option} ${selected ? styles.selected : ""}`}
                                href={option.href}
                            >
                                {option.label}
                            </NextLink>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}