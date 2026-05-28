import styles from "./CardGroup.module.css"
import { ReactElement } from "react"
import Card from "../Card"
import Accent from "@/types/Accent"

type Card = {
    color?: Accent,
    label: string,
    children: ReactElement
}

type CardGroupProps = {
    cards: Card[]
}

export default function CardGroup({ cards }: CardGroupProps) {
    return (
        <ul className={styles.lst}>
            {cards.map(card => (
                <li key={card.label}>
                    <Card color={card.color} label={card.label}>
                        {card.children}
                    </Card>
                </li>
            ))}
        </ul>
    )
}