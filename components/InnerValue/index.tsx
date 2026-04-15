import styles from "./InnerValue.module.css"

type InnerValueProps = {
    color?: string,
    label: string
}

export default function InnerValue(props: InnerValueProps) {
    return (
        <p
            className={styles.value}
            style={{
                color: props.color
            }}
        >
            {props.label}
        </p>
    )
}