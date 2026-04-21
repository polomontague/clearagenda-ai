import styles from "./Range.module.css"

type RangeProps = {
    fieldset?: boolean,
    min: string,
    max: string
    value: number
}

export default function Range(props: RangeProps) {
    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <span className={styles.label}>{props.min}</span>
            <div className={styles.containerTrack}>
                <div className={styles.track}></div>
                <div className={styles.containerIndicator}>
                    <div
                        className={styles.indicator}
                        style={{ width: `${props.value * 100}%` }}
                    ></div>
                </div>
            </div>
            <span className={styles.label}>{props.max}</span>
        </div>
    )
}