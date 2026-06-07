import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import styles from "./Pain.module.css"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Bold from "../Bold"
import Subheading from "../Subheading"
import IconList from "../IconList"
import { AgendaIcon, CalendarIcon, EditIcon, LeftArrowIcon, StressFaceIcon } from "../Icons"

export default function Pain() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>The hidden cost of productivity systems</Eyebrow>
                <Heading margin>Your current system is costing <Emphasis>you more than time</Emphasis></Heading>
                <Paragraph margin>If you're like most people, you already have:</Paragraph>

                <IconList
                    margin
                    items={[
                        { icon: <CalendarIcon />, label: "A calendar you don't fully trust" },
                        { icon: <AgendaIcon />, label: "A to-do list you avoid looking at" },
                        { icon: <EditIcon />, label: "Tasks you keep rewriting instead of doing" },
                        { icon: <StressFaceIcon />, label: "A constant sense that you're behind, even when you're not" } 
                    ]}
                />
                <Subheading margin><Bold>The problem isn't discipline.</Bold></Subheading>
                <Heading margin><Emphasis>It's friction</Emphasis></Heading>
                <Paragraph margin>Every small decision—when should I do this, how long will it take, where does it fit—creates mental resistance.</Paragraph>
                <Paragraph><Bold>So things get postponed. Forgotten. Or carried around in your head.</Bold></Paragraph>
            </div>
        </section>
    )
}