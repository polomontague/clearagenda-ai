import styles from "./Testimony.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"

export default function Testimony() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <div className={styles.header}>
                    <Eyebrow>The experience</Eyebrow>
                    <Heading>What using ClearAgenda <Emphasis>feels like</Emphasis></Heading>

                    <p className={styles.lead}>
                        Less planning. Less guilt. Less mental overhead.
                    </p>
                </div>

                <div className={styles.quotes}>
                    <blockquote className={styles.quote}>
                        <p>
                            It's like waking up and already having a calm,
                            realistic plan for the day.
                        </p>
                    </blockquote>

                    <blockquote className={styles.quote}>
                        <p>
                            I stopped reorganizing my tasks and actually
                            started finishing them.
                        </p>
                    </blockquote>

                    <blockquote className={styles.quote}>
                        <p>
                            I didn't realize how much energy I was spending
                            deciding what to do next.
                        </p>
                    </blockquote>
                </div>
            </div>
        </section>
    )
}