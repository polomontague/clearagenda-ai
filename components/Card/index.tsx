"use client"
import styles from "./Card.module.css"
import { ReactNode } from "react"
import { EditIcon, TrashCanIcon } from "@/components/Icons"

type CardProps = {
    label: string,
    onRequestEdit: () => void,
    onRequestDelete: () => void,
    children: ReactNode
}

export default function Card(props: CardProps) {
    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <h6 className={styles.label} title={props.label}>
                    {props.label}
                    <div className={styles.fade}></div>
                </h6>
                <div className={styles.containerBtns}>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={props.onRequestEdit}
                    >
                        <EditIcon />
                    </button>
                    <button
                        type="button"
                        className={styles.btn}
                        onClick={props.onRequestDelete}
                    >
                        <TrashCanIcon />
                    </button>
                </div>
            </header>
            <div className={styles.containerChildren}>
                {props.children}
            </div>
        </div>
    )
}