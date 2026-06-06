import styles from "./Eyebrow.module.css"

type EyebrowProps = {
    children: string
}

export default function Eyebrow({ children }: EyebrowProps) {
    return (
        <p className={styles.eyebrow}>{children}</p>
    )
}