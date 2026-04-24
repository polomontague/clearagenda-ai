import styles from "./InnerValue.module.css"

type InnerValueProps = {
    color?: string,
    label: string
}

export default function InnerValue({ color, label }: InnerValueProps) {
    return (
        <p
            className={styles.value}
            style={{
                color
            }}
        >
            {label}
        </p>
    )
}