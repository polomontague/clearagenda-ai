"use client"
import styles from "./RangeInput.module.css"

const RangeInput = (props: {
    fieldset?: boolean,
    min: number,
    max: number,
    step: number,
    value: number,
    onChange: (val: number) => void
}) => {
    return (
        <div className={`${styles.input} ${props.fieldset ? styles.fieldset : ""}`}>
            <input
                className={styles.slider}
                type="range"
                min={props.min}
                max={props.max}
                step={props.step}
                value={props.value}
                onChange={(evt) => props.onChange(parseInt(evt.target.value))}
            />
        </div>
    )
}

export default RangeInput