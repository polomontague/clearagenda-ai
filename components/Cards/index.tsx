import { ReactElement } from "react"
import styles from "./Cards.module.css"

type Card = {
    icon: ReactElement<SVGElement>,
    label: string,
    content: string
}

type CardsProps = {
    layer?: 2 | 3,
    cards: Card[]
}

export default function Cards({ layer = 2, cards }: CardsProps) {
    return (
        <ul className={`${styles.lst} ${styles[`layer${layer}`]}`}>
            {cards.map(card => (
                <li
                    key={card.label}
                    className={styles.card}
                >
                    <div className={styles.containerIcon}>
                        {card.icon}
                    </div>
                    <div className={styles.containerContent}>
                        <h5 className={styles.label}>{card.label}</h5>
                        <p className={styles.content}>{card.content}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}