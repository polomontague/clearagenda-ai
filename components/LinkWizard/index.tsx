"use client"
import styles from "./Wizard.module.css"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import IconButton from "@/components/IconButton"
import { LeftArrowIcon, RightArrowIcon } from "@/components/Icons"
import { useRouter } from "next/navigation"
import Fieldset from "@/components/Fieldset"

type Link = {
    href: string,
    label: string
}

type LinkWizardProps = {
    label: string,
    links: Link[]
    children: ReactNode
}

export default function LinkWizard(props: LinkWizardProps) {
    const pathname = usePathname()
    const index = props.links.findIndex(link => link.href === pathname)
    const router = useRouter()

    const handleBackClick = () => {
        router.push(props.links[index - 1].href)
    }

    const handleNextClick = () => {
        router.push(props.links[index + 1].href)
    }

    return (
        <div className={styles.background}>
            <Fieldset layer={2} label={props.label}>
                <div className={styles.window}>
                    <header className={styles.header}>
                        <h1 className={styles.label}>
                            {props.links[index].label}
                        </h1>
                        <div className={styles.containerBtns}>
                            <IconButton
                                icon={<LeftArrowIcon />}
                                disabled={index === 0}
                                onClick={handleBackClick}
                            />
                            <IconButton
                                icon={<RightArrowIcon />}
                                disabled={index === props.links.length - 1}
                                onClick={handleNextClick}
                            />
                        </div>
                    </header>
                    <div className={styles.containerScroll}>
                        <div className={styles.containerChildren}>
                            {props.children}
                        </div>
                    </div>
                </div>
            </Fieldset>
        </div>
    )
}