import styles from "./Logo.module.css"
import { LogoIcon } from "@/components/Icons"

export default function Logo() {
    return (
        <div className={styles.frame}>
            <LogoIcon />
            <h1 className={styles.name}>ClearAgenda AI</h1>
        </div>
    )
}