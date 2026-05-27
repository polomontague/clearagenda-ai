"use client"
import styles from "./AccentPicker.module.css"
import Accent from "@/types/Accent"
import { CheckMarkIcon } from "@/components/Icons"

type ColorPickerProps = {
    fieldset?: boolean,
    value: Accent,
    onChange: (value: Accent) => void
}

export default function AccentColorPicker(props: ColorPickerProps) {
    const colors: {
        value: Accent,
        label: string,
        color: string
    }[] = [
        { value: "red", label: "Red", color: "var(--red)" },
        { value: "orange", label: "Orange", color: "var(--orange)" },
        { value: "coral", label: "Coral", color: "var(--coral)" },
        { value: "yellow", label: "Yellow", color: "var(--yellow)" },
        { value: "lime", label: "Lime", color: "var(--lime)" },
        { value: "green", label: "Green", color: "var(--green)" },
        { value: "mint", label: "Mint", color: "var(--mint)" },
        { value: "turquoise", label: "Turquoise", color: "var(--turquoise)" },
        { value: "sky", label: "Sky", color: "var(--sky)" },
        { value: "lavender", label: "Lavender", color: "var(--lavender)" },
        { value: "pink", label: "Pink", color: "var(--pink)" }
    ]

    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <ul className={styles.lst}>
                {colors.map((color, i) => {
                    const selected = color.value === props.value
                    return (
                        <li key={color.value}>
                            <button
                                type="button"
                                className={`${styles.btn} ${selected ? styles.selected : ""}`}
                                style={{ backgroundColor: color.color }}
                                onClick={() => props.onChange(color.value)}
                            >
                                <CheckMarkIcon />
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}