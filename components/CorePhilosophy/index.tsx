import styles from "./CorePhilosophy.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Subheading from "../Subheading"

export default function CorePhilosophy() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <div>
                    <Eyebrow>Core Philosophy</Eyebrow>
                    <Heading margin>A calendar shouldn't <Emphasis>require maintenance</Emphasis></Heading>
                    <Paragraph>Traditional productivity tools assume you want to manage your life like a project.</Paragraph>
                </div>
                <div>
                    <Paragraph margin>ClearAgenda AI assumes something different.</Paragraph>
                    <Subheading margin>You don't need more control.</Subheading>
                    <Heading margin>You need less friction.</Heading>
                    <Paragraph>Instead of giving you more things to organize, it organizes them for you.</Paragraph>
                </div>
            </div>
        </section>
    )
}