import styles from "./Button.module.css"
import Spinner from "@/components/Spinner"
import { MouseEvent } from "react"

type ButtonProps = {
    label: string,
    disabled?: boolean
    loading?: boolean,
    onClick?: (event: MouseEvent) => void
}

const Button = (props: ButtonProps) => {
    return (
        <button
            type="submit"
            className={styles.btn}
            disabled={(props.disabled || props.loading) ? true : false}
            onClick={props.onClick}
        >
            {props.label}
            {props.loading ? (
                <div className={styles.containerSpinner}>
                    <Spinner />
                </div>
            ) : null}
        </button>
    )
}

export default Button