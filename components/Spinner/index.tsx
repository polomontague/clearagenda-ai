import styles from './Spinner.module.css'

const Spinner = () => {
    return (
        <div
            className={styles.spinner}
        >
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
            <div className={styles.blade}></div>
        </div>
    )
}

export default Spinner