"use client"
import styles from "./NavigationFrame.module.css"
import { ReactNode, ReactElement } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Link = {
	icon: ReactElement<SVGElement>,
	href: string,
	label: string
}

type NavigationFrameProps = {
    links: Link[],
    children: ReactNode
}

export default function NavigationFrame(props: NavigationFrameProps) {
    const pathname = usePathname()

    return (
        <div className={styles.frame}>
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    <ul className={styles.lstLinks}>
                        {props.links.map((link, i) => {
                            const selected = link.href === pathname
                            return (
                                <li key={i}>
                                    <Link
                                        className={`${styles.link} ${selected ? styles.selected : ""}`}
                                        href={link.href}
                                    >
                                        <div className={styles.containerIcon}>
                                            {link.icon}
                                        </div>
                                        <span className={styles.label}>{link.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </aside>
            <main className={styles.main}>
                {props.children}
            </main>
        </div>
    )
}