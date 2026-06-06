import styles from "./ValueProposition.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"

export default function ValueProposition() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Focus on your work, not your workflow.</Eyebrow>
                <Heading>The simplest way to stay on track <Emphasis>without thinking about staying on track</Emphasis></Heading>

                <p className={styles.problem}>
                    Most productivity tools make you manage your system.
                </p>

                <p className={styles.solution}>
                    ClearAgenda AI removes the system entirely from your attention.
                </p>

                <div className={styles.mantra}>
                    <span>You Speak</span>
                    <span>It Organizes</span>
                    <span>You Execute</span>
                </div>
            </div>
        </section>
    )
}

/*<section>
            <h3>The simplest way to stay on track without thinking about staying on track.</h3>
            <p>Most productivity tools make you manage your system.</p>
            <p>ClearAgenda AI removes the system entirely from your attention.</p>
            <p>You speak. It Organizes. You Execute</p>
        </section>*/