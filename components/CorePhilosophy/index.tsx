import styles from "./CorePhilosophy.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"

export default function CorePhilosophy() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <div className={styles.left}>
                    <Eyebrow>Core Philosophy</Eyebrow>
                    <Heading>A calendar shouldn't <Emphasis>require maintenance</Emphasis></Heading>

                    <p className={styles.lead}>
                        Traditional productivity tools assume you want to manage your
                        life like a project.
                    </p>
                </div>

                <div className={styles.right}>
                    <p className={styles.intro}>
                        ClearAgenda AI assumes something different.
                    </p>

                    <div className={styles.reframe}>
                        <p>You don't need more control.</p>
                        <p>You need less friction.</p>
                    </div>

                    <p className={styles.conclusion}>
                        Instead of giving you more things to organize,
                        it organizes them for you.
                    </p>
                </div>
            </div>
        </section>
    )
}