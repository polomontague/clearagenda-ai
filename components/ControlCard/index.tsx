"use client"
import styles from "./ControlCard.module.css"
import { ReactNode } from "react"
import { EditIcon, TrashCanIcon } from "@/components/Icons"
import IconButton from "@/components/IconButton"

type ControlCardProps = {
    label: string,
    onRequestEdit: () => void,
    onRequestDelete: () => void,
    children: ReactNode
}

export default function ControlCard(props: ControlCardProps) {
    return (
        <div className={styles.card}>
            <header className={styles.header}>
                <h6 className={styles.label} title={props.label}>
                    {props.label}
                    <div className={styles.fade}></div>
                </h6>
                <div className={styles.containerBtns}>
                    <IconButton
                        icon={<EditIcon />}
                        onClick={props.onRequestEdit}
                    />
                    <IconButton
                        icon={<TrashCanIcon />}
                        onClick={props.onRequestDelete}
                    />
                </div>
            </header>
            <div className={styles.containerChildren}>
                {props.children}
            </div>
        </div>
    )
}