"use client"
import { ReactNode } from "react"
import styles from "./Window.module.css"
import Logo from "@/components/Logo"

type WindowProps = {
    label: string,
    children: ReactNode
}

export default function Window(props: WindowProps) {
    return (
        <div className={styles.background}>
            <header className={styles.header}>
                <Logo />
            </header>
            <div className={styles.window}>
                <header className={styles.header}>
                    <h1 className={styles.label}>{props.label}</h1>
                </header>
                <div className={styles.containerScroll}>
                    <div className={styles.containerChildren}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}