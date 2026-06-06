import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import styles from "./Pain.module.css"
import Emphasis from "../Emphasis"

export default function Pain() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>The hidden cost of productivity systems</Eyebrow>
                <Heading>Your current system is costing <Emphasis>you more than time</Emphasis></Heading>

                <p className={styles.intro}>
                    If you're like most people, you already have:
                </p>

                <ul className={styles["pain-list"]}>
                    <li>A calendar you don't fully trust</li>
                    <li>A to-do list you avoid looking at</li>
                    <li>Tasks you keep rewriting instead of doing</li>
                    <li>A constant sense that you're behind, even when you're not</li>
                </ul>

                <div className={styles.reframe}>
                    <p>The problem isn't discipline.</p>
                    <p>It's friction.</p>
                </div>

                <p className={styles.explanation}>
                    Every small decision—when should I do this, how long will it take,
                    where does it fit—creates mental resistance.
                </p>

                <p className={styles.outcome}>
                    So things get postponed. Forgotten. Or carried around in your head.
                </p>
            </div>
        </section>
    )
}