import styles from "./InnerButton.module.css"

type InnerButtonProps = {
    color?: string,
    label: string,
    onClick: () => void
}

export default function InnerButton({ color, label, onClick }: InnerButtonProps) {
    return (
        <button
            type="button"
            className={styles.btn}
            style={{
                color
            }}
            onClick={() => onClick()}
        >
            {label}
        </button>
    )
}