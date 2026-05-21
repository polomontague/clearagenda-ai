"use client"
import styles from "./SlideField.module.css"
import { ReactNode, useState } from "react"
import { RightArrowIcon, LeftArrowIcon } from "../Icons"

type SlideFieldProps = {
    fieldset?: boolean
    label: string,
    value: string,
    children: ReactNode
}

export default function SlideField(props: SlideFieldProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}
                onClick={() => setOpen(true)}
            >
                <span className={styles.label}>{props.label}</span>
                <div className={styles.value}>
                    {props.value}
                    <RightArrowIcon />
                </div>
            </button>
            <div className={`${styles.slide} ${open ? styles.open : styles.closed}`}>
                <div className={styles.containerScroll}>
                    <div className={styles.containerChildren}>
                        {props.children}
                    </div>
                </div>
                <header className={styles.header}>
                    <h5 className={styles.label}>{props.label}</h5>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnBack}`}
                        onClick={() => setOpen(false)}
                    >
                        <LeftArrowIcon />
                        Back
                    </button>
                </header>
            </div>
        </>
    )
}