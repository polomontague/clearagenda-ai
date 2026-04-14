import { ReactNode } from "react"
import styles from "./Wizard.module.css"

type WizardProps = {
    children: ReactNode
}

export default function Wizard(props: WizardProps) {
    return (
        <div className={styles.background}>

        </div>
    )
}