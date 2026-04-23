"use client"
import styles from "./FormModal.module.css"
import { ReactNode, useContext, SetStateAction, RefObject, Dispatch, createContext, useRef, useState, useEffect } from "react"
export { default as Option } from "./Option"
export { default as Slide } from "./Slide"

type FormModalProps = {
    open: boolean,
    label: string,
    onRequestCancel: () => void,
    children: ReactNode
}

type DoneButtonProps = {
    disabled: boolean
}

const SubmitContext = createContext<{
    ghostButtonRef: RefObject<HTMLButtonElement | null> | null,
    setDoneDisabled: Dispatch<SetStateAction<boolean>>
}>({
    ghostButtonRef: null,
    setDoneDisabled: () => {}
})

export const DoneButton = (props: DoneButtonProps) => {
    const { ghostButtonRef, setDoneDisabled } = useContext(SubmitContext)

    useEffect(() => {
        setDoneDisabled(props.disabled)
    }, [ props.disabled ])

    return (
        <button
            type="submit"
            className={styles.btnGhost}
            disabled={props.disabled}
            ref={ghostButtonRef}
        ></button>
    )
}

export default function FormModal(props: FormModalProps) {
    const [doneDisabled, setDoneDisabled] = useState(true)
    const ghostButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        document.documentElement.style.overflow = props.open ? "hidden" : "scroll"
    }, [props.open])

    const handleDoneClick = () => {
        if (!ghostButtonRef.current) return
        ghostButtonRef.current.click()
    }

    return (
        <SubmitContext.Provider value={{ ghostButtonRef, setDoneDisabled }}>
            <div className={`${styles.overlay} ${props.open ? styles.open : styles.closed}`}>
                <div className={styles.window}>
                    <div className={styles.containerScroll}>
                        <div className={styles.containerChildren}>
                            {props.children}
                        </div>
                    </div>
                    <header className={styles.header}>
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnLeft}`}
                            onClick={() => props.onRequestCancel()}
                        >Cancel</button>
                        <h6 className={styles.label}>{props.label}</h6>
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnRight}`}
                            disabled={doneDisabled}
                            onClick={handleDoneClick}
                        >Done</button>
                    </header>
                </div>
            </div>
        </SubmitContext.Provider>
    )
}