import styles from "./Hero.module.css"
import LinkButton from "../LinkButton"
import SecondaryButton from "../SecondaryButton"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Subheading from "../Subheading"
import Bold from "../Bold"

export default function Hero() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Heading margin>Your life, <Emphasis>automatically organized</Emphasis></Heading>
                <Subheading margin>
                    <Bold>Stop managing your calendar.</Bold><br />
                    <Emphasis>Start living it.</Emphasis>
                </Subheading>
                <Paragraph margin>ClearAgenda AI turns your tasks, goals, and reminders into structured, realistic plan automatically scheduled across your week based on your availability and energy.</Paragraph>
                <Paragraph margin>No planning sessions. No mental juggling. No overwhelm.</Paragraph>
                <Paragraph margin>Just describe what you need to do. ClearAgenda AI handles the rest.</Paragraph>
                <div className={styles.containerBtns}>
                    <LinkButton narrow href="/get-started" label="Clear Your Mind Today" />
                    <SecondaryButton narrow label="See How It Works" onClick={() => {}} />
                </div>
            </div>
        </section>
    )
}