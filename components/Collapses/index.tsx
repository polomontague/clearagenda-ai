"use client"
import styles from "./Collapses.module.css"
import { ReactElement, createContext, useContext } from "react"

type CollapsesProps = {
    value?: string
    children: ReactElement
}

type CollapseProps = {
    value: string,
    children: ReactElement
}

const OpenContext = createContext<string | undefined>(undefined)

export default function Collapses(props: CollapsesProps) {
    return (
        <OpenContext.Provider value={props.value}>
            {props.children}
        </OpenContext.Provider>
    )
}

export const Collapse = (props: CollapseProps) => {
    const value = useContext(OpenContext)
    const open = value === props.value
    return (
        <div className={`${styles.containerChildren} ${open ? styles.open : styles.collapsed}`}>
            {props.children}
        </div>
    )
}