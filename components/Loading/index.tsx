import styles from "./Loading.module.css"
import Spinner from "@/components/Spinner"

type LoadingProps = {
    loading: boolean
}

export default function Loading(props: LoadingProps) {
    return (
        <div className={`${styles.overlay} ${props.loading ? styles.loading : ""}`}>
            <div className={styles.containerSpinner}>
                <Spinner />
            </div>
        </div>
    )
}