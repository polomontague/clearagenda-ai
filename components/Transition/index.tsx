import styles from "./Transition.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"

export default function Transition() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>There is another way.</Eyebrow>
                <Heading>What if none of that was <Emphasis>your job anymore</Emphasis></Heading>

                <p className={styles.lead}>
                    ClearAgenda AI removes the planning layer entirely.
                </p>

                <div className={styles.statements}>
                    <p>You don't organize your life.</p>
                    <p>You describe it.</p>
                </div>
            </div>
        </section>
    )
}