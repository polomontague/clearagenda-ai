import styles from "./BaforeAndAfter.module.css"
import { Fragment, ReactElement } from "react"
import { CheckMarkIcon } from "../Icons"
import Eyebrow from "../Eyebrow"

type Item = {
    icon: ReactElement<SVGElement>,
    label: string
}

export default function BeforeAndAfter() {
    const renderCard = (label: string, items: Item[], className: string) => {
        return (
            <div className={styles.card}>
                <header className={styles.header}>
                    <h5 className={styles.label}>{label}</h5>
                </header>
                <div className={styles.containerLst}>
                    <ul className={`${styles.lst} ${className}`}>
                        {items.map((item, i) => (
                            <li key={i}>
                                {item.icon}
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Before and After</Eyebrow>
                <ul className={styles.lstCards}>
                    <li>
                        {renderCard("Before ClearAgenda AI", [
                            { icon: <CheckMarkIcon />, label: "Your tasks live in your head, notes, and scattered apps" },
                            { icon: <CheckMarkIcon />, label: "Planning takes longer than doing" },
                            { icon: <CheckMarkIcon />, label: "You constantly feel behind" },
                            { icon: <CheckMarkIcon />, label: "You underestimate how much time things take" },
                            { icon: <CheckMarkIcon />, label: "Your calendar doesn't reflect your real life" }
                        ], styles.lstBefore)}
                    </li>
                    <li>
                        {renderCard("After ClearAgenda AI", [
                            { icon: <CheckMarkIcon />, label: "Everything is captured instantly in one place" },
                            { icon: <CheckMarkIcon />, label: "Your day is already structured when you wake up" },
                            { icon: <CheckMarkIcon />, label: "You always know what to do next" },
                            { icon: <CheckMarkIcon />, label: "Tasks are realistic and time-blocked automatically" },
                            { icon: <CheckMarkIcon />, label: "Your agenda reflects your actual capacity, not your intentions" }
                        ], styles.lstAfter)}
                    </li>
                </ul>
            </div>
        </section>
    )
}