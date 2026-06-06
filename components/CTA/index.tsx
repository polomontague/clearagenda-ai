import styles from "./CTA.module.css"
import LinkButton from "../LinkButton"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"

export default function CTA() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Ready to simplify your day?</Eyebrow>
                <Heading>
                    Stop planning.<br />
                    <Emphasis>Start doing.</Emphasis>
                </Heading>

                <p className={styles.lead}>
                    Your life doesn't need more organization tools.
                </p>

                <p className={styles.emphasis}>
                    It needs clarity.
                </p>

                <p className={styles.description}>
                    ClearAgenda AI turns everything you need to do into a plan
                    you can actually follow.
                </p>

                <div className={styles.actions}>
                    <LinkButton
                        narrow
                        href="/get-started"
                        label="Get Started"
                    />
                </div>
            </div>
        </section>
    )
}