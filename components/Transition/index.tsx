import styles from "./Transition.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Paragraph from "../Paragraph"
import Bold from "../Bold"
import Subheading from "../Subheading"

export default function Transition() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>There is another way.</Eyebrow>
                <Heading margin>What if none of that was <Emphasis>your job anymore</Emphasis></Heading>
                <Paragraph margin><Bold>ClearAgenda AI removes the planning layer entirely.</Bold></Paragraph>
                <Subheading margin>You don't organize your life.</Subheading>
                <Subheading><Bold>You describe it</Bold></Subheading>
            </div>
        </section>
    )
}