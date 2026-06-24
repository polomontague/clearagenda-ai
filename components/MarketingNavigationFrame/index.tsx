import styles from "./MarketingNavigationFrame.module.css"
import { ReactNode } from "react"
import Logo from "../Logo"
import Link from "next/link"
import AuthButton from "../AuthButton"

export default function MarketingNavigationFrame({ children }: { children: ReactNode }) {
    return (
        <div>
            <header className={styles.header}>
                <Link href="/">
                    <Logo />
                </Link>
                <div className={styles.containerCTA}>
                    <AuthButton />
                </div>
            </header>
            <div className={styles.containerChildren}>
                {children}
            </div>
        </div>
    )
}