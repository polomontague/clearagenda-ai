import styles from "./List.module.css"
import { ReactElement, ReactNode } from "react"

type ListItemElement = ReactElement<ListItemProps, typeof ListItem>

type ListProps = {
    children: ListItemElement | ListItemElement[]
}

type ListItemProps = {
    children: ReactNode
}

export default function List(props: ListProps) {
    return (
        <ul className={styles.lst}>
            {props.children}
        </ul>
    )
}

export const ListItem = (props: ListItemProps) => {
    return (
        <li className={styles.lstItem}>
            {props.children}
        </li>
    )
}