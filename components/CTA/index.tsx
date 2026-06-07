import styles from "./CTA.module.css"
import LinkButton from "../LinkButton"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Subheading from "../Subheading"

export default function CTA() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Ready to simplify your day?</Eyebrow>
                <Heading margin>
                    Stop planning.<br />
                    <Emphasis>Start doing.</Emphasis>
                </Heading>
                <Subheading margin>Your life doesn't need more organization tools.</Subheading>
                <Heading margin>It needs clarity.</Heading>
                <Paragraph>ClearAgenda AI turns everything you need to do into a plan you can actually follow.</Paragraph>
                <div className={styles.containerBtn}>
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