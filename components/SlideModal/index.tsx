"use client"
import styles from "./SlideModal.module.css"
import { useEffect, useState, ReactElement, cloneElement, ReactNode, createContext, useContext } from "react"
import { LeftArrowIcon, RightArrowIcon } from "@/components/Icons"

type SlideModalSlideElement = ReactElement<SlideModalSlideProps, typeof SlideModalSlide>

type SlideModalProps = {
    label: string,
    open: boolean,
    onRequestClose: () => void,
    children: ReactNode
}

type SlideModalOptionProps = {
    label: string,
    children: SlideModalSlideElement
}

type SlideModalSlideProps = {
    label?: string,
    open?: boolean,
    onRequestBack?: () => void,
    children: ReactNode
}

const CloseContext = createContext(() => {})

export default function SlideModal(props: SlideModalProps) {
    useEffect(() => {
        document.documentElement.style.overflow = props.open ? "hidden" : "scroll"
    }, [props.open])

    return (
        <CloseContext.Provider value={props.onRequestClose}>
            <div className={`${styles.overlay} ${props.open ? styles.open : styles.closed}`}>
                <div className={styles.window}>
                    <header className={styles.header}>
                        <h5 className={styles.label}>{props.label}</h5>
                        <button
                            type="button"
                            className={styles.btnClose}
                            onClick={() => props.onRequestClose()}
                        >
                            Close
                        </button>
                    </header>
                    <div className={styles.containerScroll}>
                        {props.children}
                    </div>
                </div>
            </div>
        </CloseContext.Provider>
    )
}

export const SlideModalOption = (props: SlideModalOptionProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className={styles.btnOption}
                onClick={() => setOpen(true)}
            >
                <span className={styles.label}>{props.label}</span>
                <div className={styles.containerIcon}>
                    <RightArrowIcon />
                </div>
            </button>
            {cloneElement(props.children, {
                label: props.label,
                open,
                onRequestBack: () => setOpen(false),
            })}
        </>
    )
}

export const SlideModalSlide = (props: SlideModalSlideProps) => {
    const onRequestClose = useContext(CloseContext)

    return (
        <div className={`${styles.slide} ${props.open ? styles.open : styles.closed}`}>
            <header className={styles.header}>
                <h6 className={styles.label}>{props.label}</h6>
                <button
                    type="button"
                    className={styles.btnBack}
                    onClick={() => props.onRequestBack ? props.onRequestBack() : undefined}
                >
                    <LeftArrowIcon />
                    Back
                </button>
                <button
                    type="button"
                    className={styles.btnClose}
                    onClick={() => onRequestClose()}
                >
                    Close
                </button>
            </header>
            <div className={styles.containerScroll}>
                <div className={styles.containerChildren}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}