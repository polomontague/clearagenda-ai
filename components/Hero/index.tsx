import styles from "./Hero.module.css"
import LinkButton from "../LinkButton"
import SecondaryButton from "../SecondaryButton"
import Heading from "../Heading"
import Emphasis from "../Emphasis"

export default function Hero() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Heading>Your life, <Emphasis>automatically organized</Emphasis></Heading>
                <h2 className={styles.subheadline}>Stop managing your calendar. Start living it.</h2>
                <p className={styles.paragraph}>ClearAgenda AI turns your tasks, goals, and reminders into structured, realistic plan automatically scheduled across your week based on your availability and energy.</p>
                <p className={styles.paragraph}>No planning sessions. No mental juggling. No overwhelm.</p>
                <p className={styles.paragraph}>Just describe what you need to do. ClearAgenda AI handles the rest.</p>
                <div className={styles.containerBtns}>
                    <LinkButton narrow href="/get-started" label="Clear Your Mind Today" />
                    <SecondaryButton narrow label="See How It Works" onClick={() => {}} />
                </div>
            </div>
        </section>
    )
}