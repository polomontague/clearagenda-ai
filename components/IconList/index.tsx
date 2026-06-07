import styles from "./IconList.module.css"
import { ReactElement } from "react"

type Item = {
    icon: ReactElement<SVGElement>,
    label: string
}

type IconListProps = {
    margin?: boolean,
    items: Item[]
}

export default function IconList({ margin = false, items }: IconListProps) {
    return (
        <ul className={`${styles.lst} ${margin ? styles.margin : ""}`}>
            {items.map(item => (
                <li key={item.label}>
                    {item.icon}
                    {item.label}
                </li>
            ))}
        </ul>
    )
}