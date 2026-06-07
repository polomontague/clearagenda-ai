import styles from "./ValueProposition.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Subheading from "../Subheading"

export default function ValueProposition() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Focus on your work, not your workflow.</Eyebrow>
                <Heading margin>The simplest way to stay on track <Emphasis>without thinking about staying on track</Emphasis></Heading>
                <Paragraph margin>Most productivity tools make you manage your system.</Paragraph>
                <Paragraph margin><Emphasis>ClearAgenda AI removes the system entirely from your attention.</Emphasis></Paragraph>
                <div className={styles.mantra}>
                    <span>You Add</span>
                    <span>It Organizes</span>
                    <span>You Execute</span>
                </div>
            </div>
        </section>
    )
}