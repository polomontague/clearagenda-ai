"use client"
import styles from "./SelectButton.module.css"
import { ReactElement, useState } from "react"

type SelectButtonOption = {
    icon: ReactElement<SVGElement>,
    label: string,
    onClick: () => void
}

type SelectButtonProps = {
    icon: ReactElement<SVGElement>,
    options: SelectButtonOption[]
}

export default function SelectButton(props: SelectButtonProps) {
    const [open, setOpen] = useState(false)

    const handleClick = (callback: () => void) => {
        setOpen(false)
        callback()
    }

    return (
        <div className={styles.background}>
            <button
                type="button"
                className={styles.btn}
                onClick={() => setOpen(true)}
            >
                {props.icon}
            </button>
            <div className={`${styles.menuAnchor} ${open ? styles.open : styles.closed}`}>
                <button
                    className={styles.overlay}
                    onClick={() => setOpen(false)}
                ></button>
                <ul className={styles.menu}>
                    {props.options.map((option, i) => (
                        <li key={i}>
                            <button
                                className={styles.btn}
                                onClick={() => handleClick(option.onClick)}
                            >
                                <div className={styles.highlight}>
                                    {option.icon}
                                    <span className={styles.label}>{option.label}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}