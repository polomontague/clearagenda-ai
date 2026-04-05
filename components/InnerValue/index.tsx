import styles from "./InnerValue.module.css"

type InnerValueProps = {
    label: string
}

export default function InnerValue(props: InnerValueProps) {
    return (
        <p className={styles.value}>
            {props.label}
        </p>
    )
}