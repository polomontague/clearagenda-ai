import styles from "./ValueBox.module.css"

type ValueBoxProps = {
    fieldset?: boolean,
    value: string
}

export default function ValueBox(props: ValueBoxProps) {
    return (
        <p className={`${styles.box} ${props.fieldset ? styles.fieldset : ""}`}>
            {props.value}
        </p>
    )
}