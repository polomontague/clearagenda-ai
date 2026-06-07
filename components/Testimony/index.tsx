import styles from "./Testimony.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Quotes from "../Quotes"

export default function Testimony() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>The experience</Eyebrow>
                <Heading margin>What using ClearAgenda <Emphasis>feels like</Emphasis></Heading>
                <Paragraph margin>Less planning. Less guilt. Less mental overhead.</Paragraph>

                <Quotes
                    quotes={[
                        { content: "It's like waking up and already having a calm, realistic plan for the day." },
                        { content: "I stopped reorganizing my tasks and actually started finishing them." },
                        { content: "I didn't realize how much energy I was spending deciding what to do next." }
                    ]}
                />
            </div>
        </section>
    )
}