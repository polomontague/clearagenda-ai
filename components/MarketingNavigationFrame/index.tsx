import styles from "./MarketingNavigationFrame.module.css"
import { ReactNode } from "react"
import LinkButton from "../LinkButton"
import Logo from "../Logo"
import Link from "next/link"

export default function MarketingNavigationFrame({ children }: { children: ReactNode }) {
    return (
        <div>
            <header className={styles.header}>
                <Link href="/">
                    <Logo />
                </Link>
                <div className={styles.containerCTA}>
                    <LinkButton narrow href="/get-started" label="Get Started" />
                </div>
            </header>
            <div className={styles.containerChildren}>
                {children}
            </div>
        </div>
    )
}