"use client"
import styles from "./TextArea.module.css"
import { useEffect, useRef } from "react"

type TextAreaProps = {
    fieldset?: boolean,
    rows: number,
    placeholder: string,
    value: string,
    onChange: (value: string) => void
}

export default function TextArea(props: TextAreaProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const container = containerRef.current
        const textArea = textAreaRef.current
  
        if (!container || !textArea) return

        container.classList.add(styles.mounted)
        textArea.style.height = "0px" // Collapse height to then read the accurate content height
        const textAreaStyles = window.getComputedStyle(textArea)
        const lineHeight = parseFloat(textAreaStyles.lineHeight)
        const minHeight = props.rows * lineHeight
        const contentHeight = textArea.scrollHeight
        const height = Math.max(minHeight, contentHeight)
        textArea.style.height = `${height}px`

        // Scale down the container height
        const fontSize = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--font-size-number"))
        const scale = fontSize / 16
        const scaledHeight = height * scale
        container.style.height = `${scaledHeight}px`
    }, [ props.value, props.rows ])

    return (
        <div className={`${styles.containerPadding} ${props.fieldset ? styles.fieldset : ""}`}>
            <div
                className={styles.containerScale}
                ref={containerRef}
            >
                <textarea
                    className={styles.textArea}
                    rows={props.rows}
                    placeholder={props.placeholder}
                    ref={textAreaRef}
                    value={props.value}
                    onChange={(evt) => props.onChange(evt.target.value)}
                />
            </div>
        </div>
    )
}