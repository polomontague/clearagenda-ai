import styles from "./UseCases.module.css"
import Eyebrow from "../Eyebrow"
import Heading from "../Heading"
import Emphasis from "../Emphasis"
import Cards from "../Cards"
import { ArrowCircleIcon, ThreePeopleIcon, CodeIcon, DownChartIcon, GraduationCap, WindIcon } from "../Icons"
import Paragraph from "../Paragraph"

export default function UseCases() {
    return (
        <section className={styles.background}>
            <div className={styles.center}>
                <Eyebrow>Who it's for</Eyebrow>
                <Heading margin>Built for <Emphasis>real-life overwhelm</Emphasis></Heading>
                <Paragraph margin>ClearAgenda AI is designed for people with too much to think about and too little time to organize it.</Paragraph>
                <Cards
                    layer={3}
                    cards={[
                        {
                            icon: <CodeIcon />,
                            label: "Developers",
                            content: "Balance deep work, side projects, learning, and daily responsibilities without constantly reorganizing priorities."
                        },
                        {
                            icon: <DownChartIcon />,
                            label: "Burnout Recovery",
                            content: "Rebuild structure gradually without maintaining a complicated productivity system."
                        },
                        {
                            icon: <GraduationCap />,
                            label: "Students",
                            content: "Keep track of assignments, exams, deadlines, and personal goals from one evolving plan."
                        },
                        {
                            icon: <ThreePeopleIcon />,
                            label: "Entrepreneurs",
                            content: "Manage shifting priorities and competing demands without losing sight of long-term goals."
                        },
                        {
                            icon: <ArrowCircleIcon />,
                            label: "Perpetual Restarters",
                            content: "Stop rebuilding productivity systems every few weeks and finally work from a plan that adapts automatically."
                        },
                        {
                            icon: <WindIcon />,
                            label: "Busy Humans",
                            content: "If your brain is carrying around dozens of unfinished commitments, ClearAgenda AI was built for you."
                        }
                    ]}
                />
            </div>
        </section>
    )
}