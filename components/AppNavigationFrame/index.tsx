"use client"
import styles from "./NavigationFrame.module.css"
import { ReactElement, ReactNode, useState } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { CalendarIcon, BrainIcon, GearIcon, PlusIcon, LogoutIcon } from "@/components/Icons"
import SettingsModal from "@/components/SettingsModal"
import FormModal from "@/components/FormModal"
import ItemForm from "@/components/ItemForm"
import Item from "@/types/Item"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"

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

type MenuItem = Link | Button

type NavigationFrameProps = {
    children: ReactNode
}

export default function NavigationFrame(props: NavigationFrameProps) {
    const pathname = usePathname()
    const [addItemModalOpen, setAddItemModalOpen] = useState(false)
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies()
    const router = useRouter()
    const items: MenuItem[] = [
        {
            type: "button",
            icon: <PlusIcon />,
            label: "Add Item",
            onClick: () => setAddItemModalOpen(true)
        },
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
        },
        {
            type: "button",
            icon: <LogoutIcon />,
            label: "Logout",
            onClick: handleLogoutClick
        }
    ]

    const handleAddItemSuccess = (item: Item) => {
        setAddItemModalOpen(false)
        console.log(item)
    }

    function handleLogoutClick() {
        removeCookie("token")
        router.push("/login")
        // TODO: Blacklist the token on the server
    }

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
                                            <span className={styles.label}>{item.label}</span>
                                        </NextLink>
                                    ) : item.type === "button" ? (
                                        <button
                                            type="button"
                                            className={styles.btn}
                                            onClick={() => item.onClick()}
                                        >
                                            {item.icon}
                                            <span className={styles.label}>{item.label}</span>
                                        </button>
                                    ) : null}
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </aside>
            <main className={styles.main}>
                {props.children}
                <FormModal
                    open={addItemModalOpen}
                    label="Add Agenda Item"
                    onRequestCancel={() => setAddItemModalOpen(false)}
                >
                    <ItemForm
                        type="new"
                        onSuccess={handleAddItemSuccess}
                    />
                </FormModal>
                <SettingsModal open={settingsModalOpen} onRequestClose={() => setSettingsModalOpen(false)} />
            </main>
        </div>
    )
}