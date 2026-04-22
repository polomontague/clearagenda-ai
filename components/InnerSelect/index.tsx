"use client"
import styles from "./InnerSelect.module.css"
import { useRef, useEffect, useState, MouseEvent } from "react"
import { UpAndDownArrowsIcon } from "@/components/Icons"

type Option<Value> = {
    value: Value,
    label: string
}

type InnerSelectProps<Value> = {
    label: string
    options: Option<Value>[],
    value: Value
    onChange: (value: Value) => void
}

export default function InnerSelect<Value>(props: InnerSelectProps<Value>) {
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({})
    const [open, setOpen] = useState(false)

    useEffect(() => {
        positionMenu()
        window.addEventListener("resize", positionMenu)
        window.addEventListener("scroll", positionMenu)
        return () => window.removeEventListener("resize", positionMenu)
    }, [])

    const positionMenu = () => {
        if (!buttonRef.current) return
        const rect = buttonRef.current.getBoundingClientRect()
        const spacing = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--spacing-small"))
        const top = rect.top
        const bottom = window.innerHeight - rect.bottom
        if (top > bottom) {
            // Position above button
            setPosition({
                left: rect.right,
                top: rect.top - spacing,
                transform: "translate(-100%, -100%)",
                marginBottom: 20
            })
        } else {
            // Position below button
            setPosition({
                left: rect.right,
                top: rect.bottom + spacing,
                transform: "translateX(-100%)"
            })
        }
    }

    const handleClick = (evt: MouseEvent, option: Option<Value>) => {
        evt.stopPropagation()
        setOpen(false)
        props.onChange(option.value)
    }

    return (
        <div className={`${styles.container} ${open ? styles.open : styles.closed}`}>
            <button
                type="button"
                className={styles.btn}
                ref={buttonRef}
                onClick={() => setOpen(!open)}
            >
                {props.label}
                <UpAndDownArrowsIcon />
            </button>
            <div
                className={styles.overlay}
                onClick={() => setOpen(false)}
            >
                <div
                    className={styles.menu}
                    style={position}
                >
                    <ul className={styles.lstOptions}>
                        {props.options.map((option, i) => {
                            const selected = option.value === props.value
                            return (
                                <li key={i}>
                                    <button
                                        type="button"
                                        className={`${styles.btnOption} ${selected ? styles.selected : ""}`}
                                        onClick={(evt) => handleClick(evt, option)}
                                    >
                                        <div className={styles.highlight}>
                                            {option.label}
                                        </div>
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </div>
    )
}