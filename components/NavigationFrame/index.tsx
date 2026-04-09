"use client"
import styles from "./NavigationFrame.module.css"
import { ReactNode, ReactElement, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SlideModal, { SlideModalOption, SlideModalSlide } from "@/components/SlideModal"
import FieldFrame from "@/components/FieldFrame"
import UpdateNameForm from "../UpdateNameForm"
import UpdateEmailForm from "../UpdateEmailForm"
import UpdatePhoneForm from "../UpdatePhoneForm"
import UpdatePasswordForm from "../UpdatePasswordForm"
import UpdatePreferencesHoursForm from "../UpdatePreferencesHoursForm"
import UpdateThemeForm from "../UpdateThemeForm"
import UpdateAccentForm from "../UpdateAccentForm"

type Link = {
	icon: ReactElement<SVGElement>,
	href: string,
	label: string
}

type NavigationFrameProps = {
    links: Link[],
    children: ReactNode
}

export default function NavigationFrame(props: NavigationFrameProps) {
    const pathname = usePathname()
    const [settingsModalOpen, setSettingsModalOpen] = useState(false)

    return (
        <div className={styles.frame}>
            <aside className={styles.sidebar}>
                <nav className={styles.nav}>
                    <ul className={styles.lstLinks}>
                        {props.links.map((link, i) => {
                            const selected = link.href === pathname
                            return (
                                <li key={i}>
                                    <Link
                                        className={`${styles.link} ${selected ? styles.selected : ""}`}
                                        href={link.href}
                                    >
                                        <div className={styles.containerIcon}>
                                            {link.icon}
                                        </div>
                                        <span className={styles.label}>{link.label}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
                <button onClick={() => setSettingsModalOpen(true)}>Settings</button>
            </aside>
            <main className={styles.main}>
                {props.children}
                <SlideModal
                    label="Settings"
                    open={settingsModalOpen}
                    onRequestClose={() => setSettingsModalOpen(false)}
                >
                    <FieldFrame>
                         <SlideModalOption label="Profile">
                            <SlideModalSlide>
                                <FieldFrame>
                                    <SlideModalOption label="Name">
                                        <SlideModalSlide>
                                            <UpdateNameForm />
                                        </SlideModalSlide>
                                    </SlideModalOption>
                                    <SlideModalOption label="Email">
                                        <SlideModalSlide>
                                            <UpdateEmailForm />
                                        </SlideModalSlide>
                                    </SlideModalOption>
                                    <SlideModalOption label="Phone Number">
                                        <SlideModalSlide>
                                            <UpdatePhoneForm />
                                        </SlideModalSlide>
                                    </SlideModalOption>
                                </FieldFrame>
                            </SlideModalSlide>
                        </SlideModalOption>
                        <SlideModalOption label="Security">
                            <SlideModalSlide>
                                <FieldFrame>
                                    <SlideModalOption label="Passsword">
                                        <SlideModalSlide>
                                            <UpdatePasswordForm />
                                        </SlideModalSlide>
                                    </SlideModalOption>
                                </FieldFrame>
                            </SlideModalSlide>
                        </SlideModalOption>
                        <SlideModalOption label="Preferences">
                            <SlideModalSlide>
                                <FieldFrame>
                                    <SlideModalOption label="Daily hours">
                                        <SlideModalSlide>
                                            <UpdatePreferencesHoursForm />
                                        </SlideModalSlide>
                                    </SlideModalOption>
                                    <SlideModalOption label="Appearance">
                                        <SlideModalSlide>
                                            <FieldFrame>
                                                <SlideModalOption label="Theme">
                                                    <SlideModalSlide>
                                                        <UpdateThemeForm />
                                                    </SlideModalSlide>
                                                </SlideModalOption>
                                                <SlideModalOption label="Accent Color">
                                                    <SlideModalSlide>
                                                        <UpdateAccentForm />
                                                    </SlideModalSlide>
                                                </SlideModalOption>
                                            </FieldFrame>
                                        </SlideModalSlide>
                                    </SlideModalOption>
                                </FieldFrame>
                            </SlideModalSlide>
                        </SlideModalOption>
                    </FieldFrame>
                </SlideModal>
            </main>
        </div>
    )
}