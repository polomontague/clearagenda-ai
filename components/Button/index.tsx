import styles from "./Button.module.css"
import Spinner from "@/components/Spinner"
import { MouseEvent, ReactElement } from "react"

type ButtonProps = {
    label: string,
    description?: string | ReactElement,
    disabled?: boolean
    loading?: boolean,
    onClick?: (event: MouseEvent) => void
}

const Button = (props: ButtonProps) => {
    return (
        <div>
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
            {props.description ? (
                <p className={styles.description}>{props.description}</p>
            ) : null}
        </div>
    )
}

export default Button