"use client"
import { ReactNode } from "react"
import styles from "./TabWindow.module.css"
import { CalendarIcon } from "@/components/Icons"
import LinkBar, { Option } from "@/components/LinkBar"

type TabWindowProps = {
    links: Option[],
    children: ReactNode
}

export default function TabWindow(props: TabWindowProps) {
    return (
        <div className={styles.background}>
            <div className={styles.window}>
                <header className={styles.header}>
                    <div className={styles.containerLogo}>
                        <CalendarIcon />
                    </div>
                    <div className={styles.containerLinks}>
                        <LinkBar
                            options={props.links}
                        />
                    </div>
                </header>
                <div className={styles.containerChildren}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}