"use client"
import styles from "./Wizard.module.css"
import { Children, ReactElement, ReactNode, useContext, createContext, useState, cloneElement } from "react"
import Fieldset from "@/components/Fieldset"
import IconButton from "../IconButton"
import { LeftArrowIcon, RightArrowIcon } from "@/components/Icons"
import Link from "next/link"
import Logo from "@/components/Logo"

type SlideElement = ReactElement<SlideProps, typeof Slide>

type WizardProps = {
    label: string,
    children: SlideElement | SlideElement[]
}

type SlideProps = {
    backDisabled?: boolean,
    nextDisabled?: boolean,
    label: string,
    children: ReactNode
}

const WizardContext = createContext<{
    onRequestBack: () => void,
    onRequestNext: () => void
}>({
    onRequestBack: () => {},
    onRequestNext: () => {}
})

export default function Wizard(props: WizardProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    return (
        <WizardContext.Provider
            value={{
                onRequestBack: () => setCurrentIndex(prev => prev - 1),
                onRequestNext: () => setCurrentIndex(prev => prev + 1)
            }}
        >
            <div className={styles.background}>
                <Fieldset layer={2} label={props.label}>
                    <div className={styles.window}>
                        <ul
                            className={styles.lstSlides}
                            style={{ marginLeft: `-${currentIndex}00%` }}
                        >
                            {Children.map(props.children, (child, i) => {
                                const backDisabled = i === 0
                                const nextDisabled = i === Children.count(props.children) - 1
                                return (
                                    <li key={i}>
                                        {cloneElement(child, {
                                            backDisabled,
                                            nextDisabled
                                        })}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </Fieldset>
                <header className={styles.header}>
                    <Link href="/">
                        <Logo />
                    </Link>
                </header>
            </div>
        </WizardContext.Provider>
    )
}

export const Slide = (props: SlideProps) => {
    const { onRequestBack, onRequestNext } = useContext(WizardContext)

    return (
        <div className={styles.slide}>
            <div className={styles.containerScroll}>
                <div className={styles.containerChildren}>
                    {props.children}
                </div>
            </div>
            <header className={styles.header}>
                <h6 className={styles.label}>{props.label}</h6>
                <div className={styles.containerBtns}>
                    <IconButton
                        icon={<LeftArrowIcon />}
                        disabled={props.backDisabled}
                        onClick={onRequestBack}
                    />
                    <IconButton
                        icon={<RightArrowIcon />}
                        disabled={props.nextDisabled}
                        onClick={onRequestNext}
                    />
                </div>
            </header>
        </div>
    )
}