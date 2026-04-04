"use client"
import { ReactNode, useContext, SetStateAction, RefObject, Dispatch, createContext, useRef, useState, useEffect } from "react"
import styles from "./Modal.module.css"

type ModalProps = {
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

export default function Modal(props: ModalProps) {
    const [doneDisabled, setDoneDisabled] = useState(true)
    const ghostButtonRef = useRef<HTMLButtonElement>(null)

    const handleDoneClick = () => {
        if (!ghostButtonRef.current) return
        ghostButtonRef.current.click()
    }

    return (
        <SubmitContext.Provider value={{ ghostButtonRef, setDoneDisabled }}>
            <div className={`${styles.overlay} ${props.open ? styles.open : styles.closed}`}>
                <div className={styles.window}>
                    <header className={styles.header}>
                        <button
                            type="button"
                            className={styles.btn}
                            onClick={() => props.onRequestCancel()}
                        >Cancel</button>
                        <p className={styles.label}>{props.label}</p>
                        <button
                            type="button"
                            className={styles.btn}
                            disabled={doneDisabled}
                            onClick={handleDoneClick}
                        >Done</button>
                    </header>
                    <div className={styles.containerScroll}>
                        <div className={styles.containerChildren}>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </SubmitContext.Provider>
    )
}