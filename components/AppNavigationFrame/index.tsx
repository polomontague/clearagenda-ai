"use client"
import styles from "./AppNavigationFrame.module.css"
import { ReactElement, ReactNode, useState, useContext } from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { CalendarIcon, BrainIcon, GearIcon, PlusIcon, LogoutIcon, MenuIcon } from "@/components/Icons"
import SettingsModal from "@/components/SettingsModal"
import FormModal from "@/components/FormModal"
import { useCookies } from "react-cookie"
import { useRouter } from "next/navigation"
import Logo from "@/components/Logo"
import Link from "next/link"
import SelectButton from "@/components/SelectButton"
import SelectBar from "../SelectBar"
import FieldFrame from "../FieldFrame"
import TaskForm from "../TaskForm"
import EventForm from "../EventForm"
import ReminderForm from "../ReminderForm"
import TasksContext from "@/contexts/TasksContext"
import EventsContext from "@/contexts/EventsContext"
import RemindersContext from "@/contexts/RemindersContext"
import Task from "@/types/Task"
import Event from "@/types/Event"
import Reminder from "@/types/Reminder"

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
            label: "New",
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
        }
    ]
    const moreOptions = [
        {
            icon: <GearIcon />,
            label: "Settings",
            onClick: () => setSettingsModalOpen(true)
        },
        {
            icon: <LogoutIcon />,
            label: "Logout",
            onClick: handleLogoutClick
        }
    ]
    const [type, setType] = useState<"task" | "event" | "reminder">("task")
    const { addTask } = useContext(TasksContext)
    const { addEvent } = useContext(EventsContext)
    const { addReminder } = useContext(RemindersContext)
    const [moreMenuOpen, setMoreMenuOpen] = useState(false)

    const handleCreateTaskSuccess = (task: Task) => {
        addTask(task)
        setAddItemModalOpen(false)
    }

    const handleCreateEventSuccess = (event: Event) => {
        addEvent(event)
        setAddItemModalOpen(false)
    }

    const handleCreateReminderSuccess = (reminder: Reminder) => {
        addReminder(reminder)
        setAddItemModalOpen(false)
    }

    function handleLogoutClick() {
        removeCookie("token")
        router.push("/login")
        // TODO: Blacklist the token on the server
    }
    
    return (
        <div className={styles.frame}>
            <main className={styles.main}>
                {props.children}
                <FormModal
                    open={addItemModalOpen}
                    label="New"
                    onRequestCancel={() => setAddItemModalOpen(false)}
                >
                    <FieldFrame>
                        <SelectBar
                            options={[
                                { value: "task", label: "Task" },
                                { value: "event", label: "Event" },
                                { value: "reminder", label: "Reminder" }
                            ]as const}
                            value={type}
                            onChange={setType}
                        />
                        {type === "task" ? (
                            <TaskForm mode="new" onSuccess={handleCreateTaskSuccess} />
                        ) : type === "event" ? (
                            <EventForm mode="new" onSuccess={handleCreateEventSuccess} />
                        ) : type === "reminder" ? (
                            <ReminderForm mode="new" onSuccess={handleCreateReminderSuccess} />
                        ) : <></>}
                    </FieldFrame>
                </FormModal>
                <SettingsModal open={settingsModalOpen} onRequestClose={() => setSettingsModalOpen(false)} />
            </main>
            <aside className={styles.sidebar}>
                <header className={styles.header}>
                    <Link href="/agenda">
                        <Logo />
                    </Link>
                </header>
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
                        <li className={`${styles.containerBtnMore} ${moreMenuOpen ? styles.open : ""}`}>
                            <button
                                type="button"
                                className={styles.btnMore}
                                onClick={() => setMoreMenuOpen(true)}
                            >
                                <MenuIcon />
                                <span className={styles.label}>More</span>
                            </button>
                            <button
                                className={styles.overlayMore}
                                onClick={() => setMoreMenuOpen(false)}
                            ></button>
                            <ul className={styles.menuMore}>
                                {moreOptions.map(option => (
                                    <li key={option.label}>
                                        <button
                                            type="button"
                                            className={styles.btnMoreMenu}
                                            onClick={() => {
                                                setMoreMenuOpen(false)
                                                option.onClick()
                                            }}
                                        >
                                            {option.icon}
                                            <span className={styles.label}>{option.label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    )
}