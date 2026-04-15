"use client"
import styles from "./PageFrame.module.css"
import { ReactElement, ReactNode } from "react"

type PageFrameProps = {
    header: {
        center: ReactElement
    },
    children: ReactNode
}

export default function PageFrame(props: PageFrameProps) {
    return (
        <div className={styles.frame}>
            <header className={styles.header}>
                <div className={styles.containerCenter}>
                    {props.header.center}
                </div>
            </header>
            <div className={styles.containerScroll}>
                <div className={styles.containerChildren}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}