"use client"
import styles from "./PageFrame.module.css"
import { ReactNode } from "react"
import SelectBar, { SelectBarOption } from "@/components/SelectBar"

type PageFrameProps = {
    tabs: {
        options: SelectBarOption[],
        value: string,
        onChange: (value: string) => void
    },
    children: ReactNode
}

export default function PageFrame(props: PageFrameProps) {
    return (
        <div className={styles.frame}>
            <header className={styles.header}>
                <SelectBar options={props.tabs.options} value={props.tabs.value} onChange={(val) => props.tabs.onChange(val)} />
            </header>
            <div className={styles.containerScroll}>
                <div className={styles.containerChildren}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}