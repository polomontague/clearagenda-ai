"use client"
import styles from "./NavigationFrame.module.css"
import { ReactElement, ReactNode, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { CalendarIcon, BrainIcon, GearIcon } from "@/components/Icons"
import SettingsModal from "@/components/SettingsModal"

type Link = {
    type: "link",
    icon: ReactElement<SVGElement>,
    href: string,
    label: string
}

type Button = {
    type: "button",
    icon: ReactElement<SVGElement>,
    label: string,
    onClick: () => void
}

type Item = Link | Button

type NavigationFrameProps = {
    children: ReactNode
}

export default function NavigationFrame(props: NavigationFrameProps) {
    const pathname = usePathname()
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)
    const items: Item[] = [
        {
            type: "link",
            icon: <CalendarIcon />,
            href: "/agenda",
            label: "Agenda"
        },
        {
            type: "link",
            icon: <BrainIcon />,
            href: "/memory",
            label: "Memory"
        },
        {
            type: "button",
            icon: <GearIcon />,
            label: "Settings",
            onClick: () => setSettingsModalOpen(true)
        }
    ]

    return (
        <div className={styles.frame}>
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    <ul className={styles.lstMenu}>
                        {items.map((item, i) => {
                            const selected = item.type === "link" ? item.href === pathname : false
                            return (
                                <li key={i}>
                                    {item.type === "link" ? (
                                        <NextLink
                                            className={`${styles.btn} ${selected ? styles.selected : ""}`}
                                            href={item.href}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </NextLink>
                                    ) : item.type === "button" ? (
                                        <button
                                            type="button"
                                            className={styles.btn}
                                            onClick={() => item.onClick()}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </button>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                <SettingsModal open={settingsModalOpen} onRequestClose={() => setSettingsModalOpen(false)} />
            </aside>
            <main className={styles.main}>
                {props.children}
            </main>
        </div>
    )
}