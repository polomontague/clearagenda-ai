import styles from "./Range.module.css"

type RangeProps = {
    fieldset?: boolean,
    value: number
}

export default function Range(props: RangeProps) {
    return (
        <div className={`${styles.background} ${props.fieldset ? styles.fieldset : ""}`}>
            <div className={styles.containerTrack}>
                <div className={styles.track}></div>
                <div className={styles.containerIndicator}>
                    <div
                        className={styles.indicator}
                        style={{ width: `${props.value * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    )
}