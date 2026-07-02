import styles from "./Button.module.css"
import Spinner from "@/components/Spinner"
import { MouseEvent, ReactElement } from "react"

type ButtonProps = {
    type?: "button" | "submit",
    narrow?: boolean,
    label: string,
    description?: string | ReactElement,
    disabled?: boolean
    loading?: boolean,
    onClick?: (event: MouseEvent) => void
}

const Button = ({ type = "submit", narrow = false, label, description, disabled = false, loading, onClick }: ButtonProps) => {
    return (
        <div className={`${styles.background} ${narrow ? styles.narrow : styles.wide}`}>
            <button
                type={type}
                className={styles.btn}
                disabled={(disabled || loading) ? true : false}
                onClick={onClick}
            >
                {label}
                {loading ? (
                    <div className={styles.containerSpinner}>
                        <Spinner />
                    </div>
                ) : null}
            </button>
            {description ? (
                <p className={styles.description}>{description}</p>
            ) : null}
        </div>
    )
}

export default Button