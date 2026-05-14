import styles from "./Option.module.css"
import { ReactElement, cloneElement, useState } from "react"
import { RightArrowIcon } from "@/components/Icons"
import Slide, { SlideProps } from "../Slide"

type SlideElement = ReactElement<SlideProps, typeof Slide>

type OptionProps = {
    fieldset?: boolean,
    label: string,
    value: string,
    children: SlideElement
}

export default function Option(props: OptionProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}
                onClick={() => setOpen(true)}
            >
                <span className={styles.label}>{props.label}</span>
                <div className={styles.value}>
                    {props.value}
                    <RightArrowIcon />
                </div>
            </button>
            {cloneElement(props.children, {
                label: props.label,
                open,
                onRequestBack: () => setOpen(false)
            })}
        </>
    )
}