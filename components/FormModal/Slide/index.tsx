import styles from "./Slide.module.css"
import { ReactNode } from "react"
import { LeftArrowIcon } from "@/components/Icons"

export type SlideProps = {
    label?: string,
    open?: boolean,
    onRequestBack?: () => void,
    children: ReactNode
}

export default function Slide(props: SlideProps) {
    return (
        <div className={`${styles.slide} ${props.open ? styles.open : styles.closed}`}>
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
                    onClick={() => props.onRequestBack && props.onRequestBack()}
                >
                    <LeftArrowIcon />
                    Back
                </button>
            </header>
        </div>
    )
}